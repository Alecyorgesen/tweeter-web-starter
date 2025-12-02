import { TweeterRequest } from "./TweeterRequest";
import { UserAliasRequest } from "./UserAliasRequest";

export interface AuthenticationRequest {
  alias: string
  password: string
}
