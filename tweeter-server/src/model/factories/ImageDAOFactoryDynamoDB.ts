import { ImageDAOFactory } from "../service/UserService";

export class ImageDAOFactoryDynamoDB implements ImageDAOFactory {
  make() {
    return new ImageDAODynamoDB();
  }
}
