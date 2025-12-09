import { FeedDAOFactory } from "../service/StatusService";

export class FeedDAOFactoryDynamoDB implements FeedDAOFactory{
  make() {
    return new FeedDAODynamoDB();
  }
}
