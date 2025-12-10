import { StatusDto, UserDto } from "tweeter-shared";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";
import { FollowDAOFactoryDynamoDB } from "../../model/factories/FollowDAOFactoryDynamoDB";
import { StoryDAOFactoryDynamoDB } from "../../model/factories/StoryDAOFactoryDynamoDB";
import { StatusService } from "../../model/service/StatusService";
import { FeedDAOFactoryDynamoDB } from "../../model/factories/FeedDAOFactoryDynamoDB";
import { UserBatch } from "./UserBatch";

const statusService = new StatusService(
  new FeedDAOFactoryDynamoDB(),
  new StoryDAOFactoryDynamoDB(),
  new FollowDAOFactoryDynamoDB(),
  new UserDAOFactoryDynamoDB()
);

export const handler = async function (event: any) {
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    const userBatch: UserBatch = JSON.parse(body);

    await statusService.postBatch(userBatch);
  }
  return null;
};
