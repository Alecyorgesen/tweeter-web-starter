import { FollowDAOFactory } from "../service/FollowService";

export class FollowDAOFactoryDynamoDB implements FollowDAOFactory {
  make() {
    return new FollowDAODynamoDB();
  }
}
