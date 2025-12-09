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

const authService = new AuthService(new AuthDAOFactoryDynamoDB());
const userService = new UserService(
  new UserDAOFactoryDynamoDB(),
  new AuthDAOFactoryDynamoDB(),
  new ImageDAOFactoryDynamoDB()
);

export const handler = async (
  request: UserAliasRequest
): Promise<UserResponse> => {
  await authService.isTokenValid(request.token, 120000);

  const user = await userService.getUser(request.userAlias);
  return {
    success: true,
    message: null,
    user: user,
  };
};
