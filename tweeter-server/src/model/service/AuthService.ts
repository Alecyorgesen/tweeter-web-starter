import { AuthToken } from "tweeter-shared";
import { AuthDAO } from "../dao/AuthDAO";

export interface AuthDAOFactory {
  make: () => AuthDAO;
}

export class AuthService {
  authDAO: AuthDAO;
  constructor(authDAOFactory: AuthDAOFactory) {
    this.authDAO = authDAOFactory.make();
  }
  async createNewToken(alias: string): Promise<AuthToken> {
    const authToken = AuthToken.Generate();
    await this.authDAO.insertAuth(authToken.token, authToken.timestamp, alias);
    return authToken;
  }
  async isTokenValid(token: string, timeValid: number): Promise<boolean> {
    // You can decide how long is valid for a token to survive in miliseconds.
    const authToken = await this.authDAO.getAuth(token);
    if (!authToken) {
      throw new Error("unauthorized, token doesn't exist");
    }
    if (authToken.timestamp + timeValid < Date.now()) {
      this.authDAO.removeAuth(token);
      throw new Error("unauthorized, token expired");
    }
    return true;
  }
  async removeAuth(token: string) {
    this.authDAO.removeAuth(token);
  }
}
