import {
  AuthToken,
  User,
  UserAliasRequest,
  AuthenticationRequest,
  RegisterRequest,
  TweeterRequest,
} from "tweeter-shared";
import { ServerFacade } from "../server/ServerFacade";

export class UserService {
  serverFacade = new ServerFacade();
  public getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    const request: UserAliasRequest = {
      token: authToken.token,
      userAlias: alias,
    };
    return await this.serverFacade.getUser(request);
  };
  public login = async (
    alias: string,
    password: string
  ): Promise<[User | null, AuthToken]> => {
    const request: AuthenticationRequest = {
      alias: alias,
      password: password,
      token: "",
    };
    return await this.serverFacade.login(request);
  };
  public register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string,
    imageFileExtension: string
  ): Promise<[User | null, AuthToken]> => {
    const request: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: userImageBase64,
      imageFileExtension: imageFileExtension,
      token: "",
    };
    return await this.serverFacade.register(request);
  };
  public logout = async (authToken: AuthToken): Promise<void> => {
    const request: TweeterRequest = {
      token: authToken.token,
    };
    await this.serverFacade.logout(request);
  };
}
