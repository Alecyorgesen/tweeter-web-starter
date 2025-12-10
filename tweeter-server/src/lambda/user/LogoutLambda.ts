import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthDAOFactoryDynamoDB } from "../../model/factories/AuthDAOFactoryDynamoDB";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";
import { ImageDAOFactoryDynamoDB } from "../../model/factories/ImageDAOFactoryDynamoDB";
import { AuthService } from "../../model/service/AuthService";

const authService = new AuthService(new AuthDAOFactoryDynamoDB());
const userService = new UserService(
  new UserDAOFactoryDynamoDB(),
  new AuthDAOFactoryDynamoDB(),
  new ImageDAOFactoryDynamoDB()
);
export const handler = async (
  request: TweeterRequest
): Promise<TweeterResponse> => {
  await userService.logout(request.token);
  return {
    success: true,
    message: null,
  };
};
