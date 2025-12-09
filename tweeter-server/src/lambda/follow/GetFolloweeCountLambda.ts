import {
  QuantityResponse,
  TweeterRequest,
  UserAliasRequest,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowDAOFactoryDynamoDB } from "../../model/factories/FollowDAOFactoryDynamoDB";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";
import { AuthService } from "../../model/service/AuthService";
import { AuthDAOFactoryDynamoDB } from "../../model/factories/AuthDAOFactoryDynamoDB";

export const handler = async (
  request: UserAliasRequest
): Promise<QuantityResponse> => {
  const authService = new AuthService(new AuthDAOFactoryDynamoDB());
  authService.isTokenValid(request.token, 120000);
  const followService = new FollowService(
    new FollowDAOFactoryDynamoDB(),
    new UserDAOFactoryDynamoDB()
  );
  const followee_number = await followService.getFolloweeCount(
    request.userAlias
  );

  return {
    success: true,
    message: null,
    amount: followee_number,
  };
};
