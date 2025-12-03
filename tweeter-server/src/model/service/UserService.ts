import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";

export class UserService {
  public getUser = async (
    token: string,
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
  ): [UserDto | null, string, number] => {
    const [firstUser, authToken] = [FakeData.instance.firstUser, FakeData.instance.authToken];
    if (firstUser) {
      return [firstUser.dto, authToken.token, authToken.timestamp]
    } else {
      return [null, authToken.token, authToken.timestamp]
    }
  };

  public register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto | null, string, number]> => {
    const [firstUser, authToken] = [FakeData.instance.firstUser, FakeData.instance.authToken];
    if (firstUser) {
      return [firstUser.dto, authToken.token, authToken.timestamp]
    } else {
      return [null, authToken.token, authToken.timestamp]
    }
  };

  public logout = async (token: string): Promise<void> => {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };
}
