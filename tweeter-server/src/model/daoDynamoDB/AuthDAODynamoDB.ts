import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthToken, UserDto } from "tweeter-shared";
import { AuthDAO } from "../dao/AuthDAO";

export class AuthDAODynamoDB implements AuthDAO {
  readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      region: "us-east-1",
    })
  );
  readonly tableName = "authToken";
  readonly authTokenAttribute = "authToken";
  readonly aliasAttribute = "user_alias";
  readonly timestampAttribute = "timestamp";

  async getAuth(token: string): Promise<AuthToken | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        [this.authTokenAttribute]: token,
      },
    });
    const response = await this.client.send(command);
    const item = response.Item;
    if (item == undefined) {
      return null;
    }
    return new AuthToken(
      item[this.authTokenAttribute],
      item[this.timestampAttribute]
    );
  }
  async removeAuth(token: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        [this.authTokenAttribute]: token,
      },
    });
    const response = await this.client.send(command);
  }
  async insertAuth(
    token: string,
    timestamp: number,
    alias: string
  ): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        [this.authTokenAttribute]: token,
        [this.aliasAttribute]: alias,
        [this.timestampAttribute]: timestamp,
      },
    });
    const response = await this.client.send(command);
  }
}
