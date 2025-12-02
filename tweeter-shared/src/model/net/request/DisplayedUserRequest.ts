import { TweeterRequest } from "./TweeterRequest";

export interface DisplayedUserRequest extends TweeterRequest {
  displayedUserAlias: string;
}
