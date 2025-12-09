import { FollowDAODynamoDB } from "../daoDynamoDB/FollowDAODynamoDB";
import { FollowDAOFactory } from "../service/FollowService";

export class FollowDAOFactoryDynamoDB implements FollowDAOFactory {
  make() {
    return new FollowDAODynamoDB();
  }
}
