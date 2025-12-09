import { AuthenticationRequest, AuthenticationResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";
import { AuthDAOFactoryDynamoDB } from "../../model/factories/AuthDAOFactoryDynamoDB";
import { ImageDAOFactoryDynamoDB } from "../../model/factories/ImageDAOFactoryDynamoDB";
const userService = new UserService(
  new UserDAOFactoryDynamoDB(),
  new AuthDAOFactoryDynamoDB(),
  new ImageDAOFactoryDynamoDB()
);
export const handler = async (
  request: AuthenticationRequest
): Promise<AuthenticationResponse> => {
  const [user, token, timestamp] = await userService.login(
    request.alias,
    request.password
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
