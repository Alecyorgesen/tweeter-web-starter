import {
  TweeterResponse,
  PagedItemRequest,
  StatusDto,
  PagedItemResponse,
  TweeterRequest,
  UserAliasRequest,
  UserResponse,
} from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";
import { AuthDAOFactoryDynamoDB } from "../../model/factories/AuthDAOFactoryDynamoDB";
import { ImageDAOFactoryDynamoDB } from "../../model/factories/ImageDAOFactoryDynamoDB";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (
  request: UserAliasRequest
): Promise<UserResponse> => {
  const authService = new AuthService(new AuthDAOFactoryDynamoDB());
  authService.isTokenValid(request.token, 120000);
  const userService = new UserService(
    new UserDAOFactoryDynamoDB(),
    new AuthDAOFactoryDynamoDB(),
    new ImageDAOFactoryDynamoDB()
  );
  const user = await userService.getUser(request.userAlias);
  return {
    success: true,
    message: null,
    user: user,
  };
};
