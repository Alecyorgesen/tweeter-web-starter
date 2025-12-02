import { AuthenticationRequest } from "./AuthenticationRequest";

export interface RegisterRequest extends AuthenticationRequest {
  firstName: string;
  lastName: string;
  userImageBytes: Uint8Array;
  imageFileExtension: string;
}
