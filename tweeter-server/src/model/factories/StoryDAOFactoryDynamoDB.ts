import { StoryDAODynamoDB } from "../daoDynamoDB/StoryDAODynamoDB";
import { StoryDAOFactory } from "../service/StatusService";

export class StoryDAOFactoryDynamoDB implements StoryDAOFactory {
  make() {
    return new StoryDAODynamoDB();
  }
}
