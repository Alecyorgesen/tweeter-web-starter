import { AuthToken, User } from "tweeter-shared";
import { StatusService } from "../services/StatusService";
import { UserService } from "../services/UserService";
import { View } from "./View";
import { Presenter } from "./Presenter";

export interface ItemScrollerView<T> extends View {
  addItems: (newItems: T[]) => void;
  displayedUser: User | null;
  authToken: AuthToken | null;
}

const PAGE_SIZE = 10;

export abstract class ItemScrollerPresenter<T> extends Presenter<
  ItemScrollerView<T>
> {
  hasMoreItems = true;
  lastItem: T | null = null;

  constructor(view: ItemScrollerView<T>) {
    super(view);
  }

  reset = async () => {
    this.lastItem = null;
    this.hasMoreItems = true;
  };

  loadMoreItems = async (lastItem: T | null) => {
    await this.doFailureReportingOperation(async () => {
      let [newItems, newLastItem, hasMore] = await this.loadMore(
        this.view.authToken!,
        this.view.displayedUser!.alias,
        PAGE_SIZE,
        lastItem
      );
      this.hasMoreItems = hasMore;
      this.lastItem = newLastItem;
      this.view.addItems(newItems);
    }, "load feed items");
  };

  getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return this.userService.getUser(authToken, alias);
  };

  abstract loadMore(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: T | null
  ): Promise<[T[], T | null, boolean]>;
}
