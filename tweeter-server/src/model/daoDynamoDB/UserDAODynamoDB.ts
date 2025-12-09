import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  QueryCommand,
  PutCommand,
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DataPage } from "../dao/DataPage";
import { UserDto } from "tweeter-shared";
import { UserDAO } from "../dao/UserDAO";

export class UserDAODynamoDB implements UserDAO {
  readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      region: "us-east-1",
    })
  );
  readonly tableName = "user";
  readonly aliasAttribute = "user_alias";
  readonly firstNameAttribute = "first_name";
  readonly lastNameAttribute = "last_name";
  readonly hashedPasswordAttribute = "password";
  readonly imageUrlAttribute = "image_url";
  readonly followerCountAttribute = "follower_count";
  readonly followeeCountAttribute = "followee_count";

  async addUser(
    firstName: string,
    lastName: string,
    alias: string,
    hashedPassword: string,
    imageUrl: string
  ): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        [this.firstNameAttribute]: firstName,
        [this.lastNameAttribute]: lastName,
        [this.aliasAttribute]: alias,
        [this.hashedPasswordAttribute]: hashedPassword,
        [this.imageUrlAttribute]: imageUrl,
        [this.followerCountAttribute]: 0,
        [this.followeeCountAttribute]: 0,
      },
    });
    const response = await this.client.send(command);
  }

  async getUser(userAlias: string): Promise<[UserDto | null, string]> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        [this.aliasAttribute]: userAlias,
      },
    });
    const response = await this.client.send(command);
    const item = response.Item;
    if (item == undefined) {
      return [null, ""];
    }
    const user: UserDto = {
      firstName: item[this.firstNameAttribute],
      lastName: item[this.lastNameAttribute],
      alias: item[this.aliasAttribute],
      imageUrl: item[this.imageUrlAttribute],
    };
    return [user, item[this.hashedPasswordAttribute]];
  }

  async incrementFollowerCount(alias: string): Promise<void> {
    await this.changeCount(alias, this.followerCountAttribute, 1);
  }
  async incrementFolloweeCount(alias: string): Promise<void> {
    await this.changeCount(alias, this.followeeCountAttribute, 1);
  }

  async decrementFollowerCount(alias: string): Promise<void> {
    await this.changeCount(alias, this.followerCountAttribute, -1);
  }
  async decrementFolloweeCount(alias: string): Promise<void> {
    await this.changeCount(alias, this.followeeCountAttribute, -1);
  }

  async changeCount(alias: string, attribute: string, amount: number) {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        [this.aliasAttribute]: alias,
      },
      UpdateExpression: `ADD ${attribute} :amount`,
      ExpressionAttributeValues: {
        ":amount": amount,
      },
    });
    const response = await this.client.send(command);
  }

  async getUserFollowersAmount(alias: string): Promise<number> {
    return await this.getUserAmount(alias, "follower");
  }
  async getUserFolloweesAmount(alias: string): Promise<number> {
    return await this.getUserAmount(alias, "followee");
  }

  async getUserAmount(alias: string, follow: string) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        [this.aliasAttribute]: alias,
      },
    });
    const response = await this.client.send(command);
    const item = response.Item;
    if (item == undefined) {
      throw new Error("bad-request: user not found");
    }
    if (follow == "follower") {
      return item[this.followerCountAttribute];
    }
    if (follow == "followee") {
      return item[this.followeeCountAttribute];
    }
  }
}
