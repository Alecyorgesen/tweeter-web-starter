import { StoryDAODynamoDB } from "../daoDynamoDB/StoryDAODynamoDB";
import { StoryDAOFactory } from "../service/StatusService";
import { UserDAOFactoryDynamoDB } from "./UserDAOFactoryDynamoDB";

export class StoryDAOFactoryDynamoDB implements StoryDAOFactory {
  make() {
    return new StoryDAODynamoDB(new UserDAOFactoryDynamoDB().make());
  }
}
