import { FeedDAODynamoDB } from "../daoDynamoDB/FeedDAODynamoDB";
import { FeedDAOFactory } from "../service/StatusService";
import { UserDAOFactoryDynamoDB } from "./UserDAOFactoryDynamoDB";

export class FeedDAOFactoryDynamoDB implements FeedDAOFactory{
  make() {
    return new FeedDAODynamoDB(new UserDAOFactoryDynamoDB().make());
  }
}
