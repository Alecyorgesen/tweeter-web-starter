import { TweeterRequest } from "./TweeterRequest";

export interface AuthenticationRequest extends TweeterRequest {
  alias: string
  password: string
}
