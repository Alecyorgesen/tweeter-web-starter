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

const authService = new AuthService(new AuthDAOFactoryDynamoDB());
const statusService = new StatusService(
  new FeedDAOFactoryDynamoDB(),
  new StoryDAOFactoryDynamoDB(),
  new FollowDAOFactoryDynamoDB()
);
export const handler = async (
  request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
  await authService.isTokenValid(request.token, TIME_VALID);

  const [statuses, hasMore] = await statusService.getStoryItems(
    request.userAlias,
    request.pageSize,
    request.lastItem
  );
  return {
    success: true,
    message: null,
    items: statuses,
    hasMore: hasMore,
    errorMessage: null,
  };
};
