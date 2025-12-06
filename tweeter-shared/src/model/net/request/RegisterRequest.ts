import { AuthenticationRequest } from "./AuthenticationRequest";

export interface RegisterRequest extends AuthenticationRequest {
  firstName: string;
  lastName: string;
  userImageBytes: string;
  imageFileExtension: string;
}
