import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  QueryCommand,
  PutCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { StatusDto, UserDto } from "tweeter-shared";
import { UserDAO } from "../dao/UserDAO";

export abstract class StatusDAODynamoDB {
  readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      region: "us-east-1",
    })
  );
  tableName = "";
  aliasAttribute = "";
  readonly timestampAttribute = "timestamp";
  readonly postAttribute = "post";
  readonly fromAttribute = "from";
  userDAO: UserDAO;
  constructor(userDAO: UserDAO) {
    this.userDAO = userDAO;
  }

  async putEntry(
    alias: string,
    timestamp: number,
    post: string,
    from: string
  ): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        [this.postAttribute]: post,
        [this.aliasAttribute]: alias,
        [this.timestampAttribute]: timestamp,
        [this.fromAttribute]: from,
      },
    });
    const response = await this.client.send(command);
  }

  async getPage(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], StatusDto | null]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      Limit: pageSize,
      ScanIndexForward: false,
      KeyConditionExpression: `${this.aliasAttribute} = :h`,
      ExclusiveStartKey:
        lastItem == null
          ? undefined
          : {
              [this.aliasAttribute]: lastItem.user.alias,
              [this.timestampAttribute]: lastItem.timestamp,
            },
      ExpressionAttributeValues: {
        ":h": alias,
      },
    });
    const response = await this.client.send(command);
    if (response.Items == undefined) {
      return [[], null];
    }

    const statuses: StatusDto[] = [];
    for (let item of response.Items) {
      const [user, password] = await this.userDAO.getUser(
        item[this.fromAttribute]
      );
      const status: StatusDto = {
        user: user!,
        timestamp: item[this.timestampAttribute],
        post: item[this.postAttribute],
      };
      statuses.push(status);
    }
    const lastKey = response.LastEvaluatedKey;
    let lastStatus: StatusDto | null = null;
    if (lastKey) {
      // const [user, password] = await this.userDAO.getUser(
      //   lastKey[this.aliasAttribute]
      // );
      const fakeUser: UserDto = {
        firstName: "",
        lastName: "",
        alias: lastKey[this.aliasAttribute],
        imageUrl: "",
      };
      lastStatus = {
        user: fakeUser!,
        timestamp: lastKey[this.timestampAttribute],
        post: "",
      };
    }
    return [statuses, lastStatus];
  }
}
