import { ImageDAOS3 } from "../daoDynamoDB/ImageDAOS3";
import { ImageDAOFactory } from "../service/UserService";

export class ImageDAOFactoryDynamoDB implements ImageDAOFactory {
  make() {
    return new ImageDAOS3();
  }
}
