import { TweeterResponse } from "./TweeterResponse";
import { UserResponse } from "./UserResponse";

export interface AuthenticationResponse extends TweeterResponse, UserResponse {
    token: string;
}