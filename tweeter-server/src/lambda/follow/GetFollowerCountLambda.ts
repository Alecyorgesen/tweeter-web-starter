import {
  QuantityResponse,
  TweeterRequest,
  UserAliasRequest,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowDAOFactoryDynamoDB } from "../../model/factories/FollowDAOFactoryDynamoDB";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";
import { AuthDAOFactoryDynamoDB } from "../../model/factories/AuthDAOFactoryDynamoDB";
import { AuthService } from "../../model/service/AuthService";

const authService = new AuthService(new AuthDAOFactoryDynamoDB());
const followService = new FollowService(
  new FollowDAOFactoryDynamoDB(),
  new UserDAOFactoryDynamoDB()
);
export const handler = async (
  request: UserAliasRequest
): Promise<QuantityResponse> => {
  await authService.isTokenValid(request.token, 120000);

  const follower_number = await followService.getFollowerCount(
    request.userAlias
  );

  return {
    success: true,
    message: null,
    amount: follower_number,
    errorMessage: null,
  };
};
