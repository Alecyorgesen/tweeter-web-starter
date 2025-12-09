import { TweeterResponse, PostStatusRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { FeedDAOFactoryDynamoDB } from "../../model/factories/FeedDAOFactoryDynamoDB";
import { StoryDAOFactoryDynamoDB } from "../../model/factories/StoryDAOFactoryDynamoDB";
import { FollowDAOFactoryDynamoDB } from "../../model/factories/FollowDAOFactoryDynamoDB";
import { AuthDAOFactoryDynamoDB } from "../../model/factories/AuthDAOFactoryDynamoDB";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
    const authService = new AuthService(new AuthDAOFactoryDynamoDB());
    authService.isTokenValid(request.token, 120000);
  const statusService = new StatusService(
    new FeedDAOFactoryDynamoDB(),
    new StoryDAOFactoryDynamoDB(),
    new FollowDAOFactoryDynamoDB()
  );
  await statusService.postStatus(request.status);
  return {
    success: true,
    message: null,
  };
};
