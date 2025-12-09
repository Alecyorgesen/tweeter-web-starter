import { AuthDAOFactory } from "../service/AuthService";

export class AuthDAOFactoryDynamoDB implements AuthDAOFactory {
  make() {
    return new AuthDAODynamoDB();
  }
}
