import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {
  public getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };
  public login = (
    alias: string,
    password: string
  ): [User | null, AuthToken] => {
    return [FakeData.instance.firstUser, FakeData.instance.authToken];
  };
  public register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User | null, AuthToken]> => {
    return [FakeData.instance.firstUser, FakeData.instance.authToken];
  }
  public logout = async (authToken: AuthToken): Promise<void> => {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };
}
