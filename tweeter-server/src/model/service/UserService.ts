import { AuthToken, User, UserDto } from "tweeter-shared";
import { UserDAO } from "../dao/UserDAO";
import bcrypt from "bcrypt";
import { AuthDAOFactory, AuthService } from "./AuthService";

export interface UserDAOFactory {
  make: () => UserDAO;
}

export class UserService {
  authService: AuthService;
  userDAO: UserDAO;
  constructor(userDAOFactory: UserDAOFactory, authDAOFactory: AuthDAOFactory) {
    this.userDAO = userDAOFactory.make();
    this.authService = new AuthService(authDAOFactory);
  }
  public getUser = async (
    token: string,
    alias: string
  ): Promise<UserDto | null> => {
    const [user, hashedPassword] = await this.userDAO.getUser(alias);
    if (user) {
      return user;
    } else {
      return null;
    }
  };

  public login = async (
    alias: string,
    password: string
  ): Promise<[UserDto | null, string, number]> => {
    const [existingUser, hashedPassword] = await this.userDAO.getUser(alias);
    if (!existingUser) {
      throw Error("unauthorized");
    }
    if (!(await bcrypt.compare(password, hashedPassword))) {
      throw Error("unauthorized");
    }
    const authToken = await this.authService.createNewToken(alias);
    return [existingUser, authToken.token, authToken.timestamp];
  };

  public register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Base64URLString,
    imageFileExtension: string
  ): Promise<[UserDto | null, string, number]> => {
    const userImageBytesUint8 = new Uint8Array(
      Buffer.from(userImageBytes, "base64")
    );
    let [existingUser, hashedPassword] = await this.userDAO.getUser(alias);
    if (existingUser) {
      throw Error("Username already taken: bad-request");
    }
    const newHashedPassword = await bcrypt.hash(password, 3);
    await this.userDAO.addUser(
      firstName,
      lastName,
      alias,
      newHashedPassword,
      imageFileExtension
    );
    let [newUser, newPassword] = await this.userDAO.getUser(alias);
    if (!newUser) {
      throw Error("Internal server error: new user doesn't exist");
    }
    const authToken = await this.authService.createNewToken(alias);
    return [newUser, authToken.token, authToken.timestamp];
  };

  public logout = async (token: string): Promise<void> => {
    this.authService.removeAuth;
  };
}
