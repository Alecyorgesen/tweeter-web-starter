import { AuthToken } from "tweeter-shared";

export interface AuthDAO {
  getAuth: (token: string) => Promise<AuthToken | null>;
  removeAuth: (token: string) => Promise<void>;
  insertAuth: (token: string, timestamp: number, alias: string) => Promise<void>;
}
