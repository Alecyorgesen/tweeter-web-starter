import { AuthenticationRequest, AuthenticationResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";

export const handler = async (
  request: AuthenticationRequest
): Promise<AuthenticationResponse> => {
  const userService = new UserService(new UserDAOFactoryDynamoDB());
  const [user, token, timestamp] = await userService.login(
    request.alias,
    request.password
  );
  return {
    success: true,
    message: null,
    user: user,
    token: token,
    timestamp: timestamp
  }
};