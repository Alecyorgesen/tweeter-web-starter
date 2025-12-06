import { UserDto } from "tweeter-shared";

export interface UserDAO {
  getUser: (userAlias: string) => Promise<[UserDto, string]>;
  addUser: (
    firstName: string,
    lastName: string,
    alias: string,
    hashedPassword: string,
    imageFileExtension: string
  ) => Promise<[UserDto, string, number]>;
}
