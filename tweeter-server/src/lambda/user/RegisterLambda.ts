import { AuthenticationResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthDAOFactoryDynamoDB } from "../../model/factories/AuthDAOFactoryDynamoDB";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";
import { ImageDAOFactoryDynamoDB } from "../../model/factories/ImageDAOFactoryDynamoDB";
const userService = new UserService(
  new UserDAOFactoryDynamoDB(),
  new AuthDAOFactoryDynamoDB(),
  new ImageDAOFactoryDynamoDB()
);
export const handler = async (
  request: RegisterRequest
): Promise<AuthenticationResponse> => {
  const [user, token, timestamp] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );
  return {
    success: true,
    message: null,
    user: user,
    token: token,
    timestamp: timestamp,
    errorMessage: null,
  };
};
