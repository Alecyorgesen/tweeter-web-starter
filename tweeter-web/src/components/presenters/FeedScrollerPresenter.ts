import { Status, AuthToken } from "tweeter-shared";
import {
  ItemScrollerPresenter,
  ItemScrollerView,
} from "./ItemScrollerPresenter";

export class FeedScrollerPresenter extends ItemScrollerPresenter<Status> {
  constructor(view: ItemScrollerView<Status>) {
    super(view);
  }

  loadMore = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], Status | null, boolean]> => {
    // TODO: Replace with the result of calling server
    return this.statusService.getFeedItems(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );
  };
}
