import { AuthToken, User, UserDto } from "tweeter-shared";
import { UserDAO } from "../dao/UserDAO";
import bcrypt from "bcrypt";
import { AuthDAOFactory, AuthService } from "./AuthService";
import { ImageDAO } from "../dao/ImageDAO";

export interface UserDAOFactory {
  make: () => UserDAO;
}
export interface ImageDAOFactory {
  make: () => ImageDAO;
}

export class UserService {
  authService: AuthService;
  userDAO: UserDAO;
  imageDAO: ImageDAO;
  constructor(
    userDAOFactory: UserDAOFactory,
    authDAOFactory: AuthDAOFactory,
    imageDAOFactory: ImageDAOFactory
  ) {
    this.userDAO = userDAOFactory.make();
    this.authService = new AuthService(authDAOFactory);
    this.imageDAO = imageDAOFactory.make();
  }
  public getUser = async (alias: string): Promise<UserDto | null> => {
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
    let [existingUser, hashedPassword] = await this.userDAO.getUser(alias);
    if (existingUser) {
      throw Error("bad-request: Username already taken");
    }
    const newHashedPassword = await bcrypt.hash(password, 3);

    const imageName = this.generateRandomLetterSequence(5);
    const imageUrl = await this.imageDAO.putImage(
      "images/" + imageName + "." + imageFileExtension,
      userImageBytes
    );

    await this.userDAO.addUser(
      firstName,
      lastName,
      alias,
      newHashedPassword,
      imageUrl
    );
    let [newUser, newPassword] = await this.userDAO.getUser(alias);
    if (!newUser) {
      throw Error("internal-server-error: new user doesn't exist");
    }
    const authToken = await this.authService.createNewToken(alias);

    return [newUser, authToken.token, authToken.timestamp];
  };

  public logout = async (token: string): Promise<void> => {
    await this.authService.removeAuth(token);
  };
  generateRandomLetterSequence(length: number): string {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let randomWord = "";
    for (let i = 0; i < length; i++) {
      randomWord += alphabet[Math.floor(Math.random() * 26)];
    }
    return randomWord;
  }
}
