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
import { TIME_VALID } from "../AuthTokenValidTime";

const authService = new AuthService(new AuthDAOFactoryDynamoDB());
const followService = new FollowService(
  new FollowDAOFactoryDynamoDB(),
  new UserDAOFactoryDynamoDB()
);

export const handler = async (
  request: UserAliasRequest
): Promise<QuantityResponse> => {
  await authService.isTokenValid(request.token, TIME_VALID);
  const followee_number = await followService.getFolloweeCount(
    request.userAlias
  );

  return {
    success: true,
    message: null,
    amount: followee_number,
    errorMessage: null,
  };
};
