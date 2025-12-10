import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowDAOFactoryDynamoDB } from "../../model/factories/FollowDAOFactoryDynamoDB";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";
import { AuthDAOFactoryDynamoDB } from "../../model/factories/AuthDAOFactoryDynamoDB";
import { AuthService } from "../../model/service/AuthService";
import { TIME_VALID } from "../AuthTokenValidTime";

const authService = new AuthService(new AuthDAOFactoryDynamoDB());
const followService = new FollowService(
  new FollowDAOFactoryDynamoDB(),
  new UserDAOFactoryDynamoDB()
);
export const handler = async (
  request: PagedItemRequest<UserDto>
): Promise<PagedItemResponse<UserDto>> => {
  await authService.isTokenValid(request.token, TIME_VALID);

  const [items, lastItem] = await followService.getFollowers(
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    items: items,
    lastItem: lastItem,
    hasMore: lastItem == null ? false : true,
  };
};
