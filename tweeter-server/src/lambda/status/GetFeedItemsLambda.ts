import {
  TweeterResponse,
  PagedItemRequest,
  StatusDto,
  PagedItemResponse,
} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { FeedDAOFactoryDynamoDB } from "../../model/factories/FeedDAOFactoryDynamoDB";
import { StoryDAOFactoryDynamoDB } from "../../model/factories/StoryDAOFactoryDynamoDB";
import { FollowDAOFactoryDynamoDB } from "../../model/factories/FollowDAOFactoryDynamoDB";
import { AuthDAOFactoryDynamoDB } from "../../model/factories/AuthDAOFactoryDynamoDB";
import { AuthService } from "../../model/service/AuthService";
import { TIME_VALID } from "../AuthTokenValidTime";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";

const authService = new AuthService(new AuthDAOFactoryDynamoDB());
const statusService = new StatusService(
  new FeedDAOFactoryDynamoDB(),
  new StoryDAOFactoryDynamoDB(),
  new FollowDAOFactoryDynamoDB(),
  new UserDAOFactoryDynamoDB()
);
export const handler = async (
  request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
  await authService.isTokenValid(request.token, TIME_VALID);

  const [statuses, lastItem] = await statusService.getFeedItems(
    request.userAlias,
    request.pageSize,
    request.lastItem
  );
  return {
    success: true,
    message: null,
    items: statuses,
    lastItem: lastItem,
    hasMore: lastItem == null ? false : true,
  };
};
