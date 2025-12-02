import { TweeterRequest } from "./TweeterRequest";
import { UserAliasRequest } from "./UserAliasRequest";

export interface DisplayedUserRequest extends TweeterRequest, UserAliasRequest {
  displayedUserAlias: string;
}
