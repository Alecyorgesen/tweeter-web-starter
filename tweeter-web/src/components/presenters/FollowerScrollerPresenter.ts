import { AuthToken, User } from "tweeter-shared";
import { ItemScrollerPresenter, ItemScrollerView } from "./ItemScrollerPresenter";

export class FollowerScrollerPresenter extends ItemScrollerPresenter<User> {
  constructor(view: ItemScrollerView<User>) {
    super(view);
  }

  loadMore = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> => {
    // TODO: Replace with the result of calling server
    return await this.followService.getFollowers(authToken, userAlias, pageSize, lastItem);
  }
}
