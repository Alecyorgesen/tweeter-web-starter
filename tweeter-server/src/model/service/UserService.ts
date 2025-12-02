import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";

export class UserService {
  public getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<UserDto | null> => {
    // TODO: Replace with the result of calling server
    const user = FakeData.instance.findUserByAlias(alias);
    if (user) {
      return user.dto
    } else {
      return null
    }
  };

  public login = (
    alias: string,
    password: string
  ): [UserDto | null, AuthToken] => {
    const [firstUser, authToken] = [FakeData.instance.firstUser, FakeData.instance.authToken];
    if (firstUser) {
      return [firstUser.dto, authToken]
    } else {
      return [null, authToken]
    }
  };

  public register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto | null, AuthToken]> => {
    const [firstUser, authToken] = [FakeData.instance.firstUser, FakeData.instance.authToken];
    if (firstUser) {
      return [firstUser.dto, authToken]
    } else {
      return [null, authToken]
    }
  };

  public logout = async (authToken: AuthToken): Promise<void> => {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };
}
