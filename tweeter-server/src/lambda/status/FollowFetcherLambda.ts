import { StatusDto, UserDto } from "tweeter-shared";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";
import { FollowService } from "../../model/service/FollowService";
import { FollowDAOFactoryDynamoDB } from "../../model/factories/FollowDAOFactoryDynamoDB";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { UserBatch } from "./UserBatch";

let sqsClient = new SQSClient({ region: "us-east-1" });
const sqs_url = "https://sqs.us-east-1.amazonaws.com/222634371701/JobsQ";

const followService = new FollowService(
  new FollowDAOFactoryDynamoDB(),
  new UserDAOFactoryDynamoDB()
);

export const handler = async function (event: any) {
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    const status: StatusDto = JSON.parse(body);
    const user = status.user;

    let lastItem: UserDto | null = null;
    do {
      const [users, currentLastItem] = await followService.getFollowers(
        user.alias,
        25,
        lastItem
      );
      lastItem = currentLastItem;
      const userBatch = new UserBatch(users, status);
      const messageBodyJson = JSON.stringify(userBatch);
      const params = {
        MessageBody: messageBodyJson,
        QueueUrl: sqs_url,
      };
      await sqsClient.send(new SendMessageCommand(params));
    } while (lastItem);
  }
  return null;
};
