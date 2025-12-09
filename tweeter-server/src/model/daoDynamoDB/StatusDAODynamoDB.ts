import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  QueryCommand,
  PutCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { StatusDto } from "tweeter-shared";

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

  async putEntry(
    alias: string,
    timestamp: number,
    post: string
  ): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        [this.postAttribute]: post,
        [this.aliasAttribute]: alias,
        [this.timestampAttribute]: timestamp,
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
      KeyConditionExpression: `${this.aliasAttribute} = :h`,
      ExclusiveStartKey:
        lastItem == null
          ? undefined
          : {
              [this.aliasAttribute]: lastItem.user,
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
      const status: StatusDto = {
        user: item[this.aliasAttribute],
        timestamp: item[this.timestampAttribute],
        post: item[this.postAttribute],
      };
      statuses.push(status);
    }
    const lastKey = response.LastEvaluatedKey;
    let lastStatus: StatusDto | null = null;
    if (lastKey != undefined) {
      lastStatus = {
        user: lastKey[this.aliasAttribute],
        timestamp: lastKey[this.timestampAttribute],
        post: lastKey[this.postAttribute],
      };
    }
    return [statuses, lastStatus];
  }
}
