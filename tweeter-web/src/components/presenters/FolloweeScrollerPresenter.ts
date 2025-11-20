import { AuthToken, User } from "tweeter-shared";
import { ItemScrollerPresenter, ItemScrollerView } from "./ItemScrollerPresenter";

export class FolloweeScrollerPresenter extends ItemScrollerPresenter<User> {

  constructor(view: ItemScrollerView<User>) {
    super(view);
  }

  loadMore = (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> => {
    // TODO: Replace with the result of calling server
    return this.followService.getFollowees(authToken, userAlias, pageSize, lastItem);
  }
}
