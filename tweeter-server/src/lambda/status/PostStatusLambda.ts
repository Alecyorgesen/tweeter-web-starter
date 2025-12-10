import { TweeterResponse, PostStatusRequest } from "tweeter-shared";
import { AuthDAOFactoryDynamoDB } from "../../model/factories/AuthDAOFactoryDynamoDB";
import { AuthService } from "../../model/service/AuthService";
import { TIME_VALID } from "../AuthTokenValidTime";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { StatusService } from "../../model/service/StatusService";
import { FeedDAOFactoryDynamoDB } from "../../model/factories/FeedDAOFactoryDynamoDB";
import { StoryDAOFactoryDynamoDB } from "../../model/factories/StoryDAOFactoryDynamoDB";
import { FollowDAOFactoryDynamoDB } from "../../model/factories/FollowDAOFactoryDynamoDB";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";

let sqsClient = new SQSClient({ region: "us-east-1" });
const sqs_url = "https://sqs.us-east-1.amazonaws.com/222634371701/PostsQ";

const authService = new AuthService(new AuthDAOFactoryDynamoDB());
const statusService = new StatusService(
  new FeedDAOFactoryDynamoDB(),
  new StoryDAOFactoryDynamoDB(),
  new FollowDAOFactoryDynamoDB(),
  new UserDAOFactoryDynamoDB()
);

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  await authService.isTokenValid(request.token, TIME_VALID);

  await statusService.postStoryStatus(request.status);

  const messageBodyJson = JSON.stringify(request.status);
  const params = {
    MessageBody: messageBodyJson,
    QueueUrl: sqs_url,
  };
  await sqsClient.send(new SendMessageCommand(params));

  return {
    success: true,
    message: null,
  };
};
