import { TweeterResponse, PostStatusRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { FeedDAOFactoryDynamoDB } from "../../model/factories/FeedDAOFactoryDynamoDB";
import { StoryDAOFactoryDynamoDB } from "../../model/factories/StoryDAOFactoryDynamoDB";
import { FollowDAOFactoryDynamoDB } from "../../model/factories/FollowDAOFactoryDynamoDB";
import { AuthDAOFactoryDynamoDB } from "../../model/factories/AuthDAOFactoryDynamoDB";
import { AuthService } from "../../model/service/AuthService";

const authService = new AuthService(new AuthDAOFactoryDynamoDB());
const statusService = new StatusService(
  new FeedDAOFactoryDynamoDB(),
  new StoryDAOFactoryDynamoDB(),
  new FollowDAOFactoryDynamoDB()
);
export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  await authService.isTokenValid(request.token, 120000);

  await statusService.postStatus(request.status);
  return {
    success: true,
    message: null,
    errorMessage: null,
  };
};
