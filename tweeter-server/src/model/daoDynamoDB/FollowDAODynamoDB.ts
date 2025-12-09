import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  QueryCommand,
  PutCommand,
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { FollowEntry } from "../dao/FollowEntry";
import { DataPage } from "../dao/DataPage";
import { FollowDAO } from "../dao/FollowDAO";
import { UserDto } from "tweeter-shared";

export class FollowDAODynamoDB implements FollowDAO {
  readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      region: "us-east-1",
    })
  );
  readonly tableName = "follow";
  readonly followerAttribute = "follower_alias";
  readonly followeeAttribute = "followee_alias";
  readonly followerName = "follower_name";
  readonly indexName = "follows_index";
  readonly followeeName = "followee_name";

  async putFollowEntry(followEntry: FollowEntry) {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        [this.followerAttribute]: followEntry.followerHandle,
        [this.followeeAttribute]: followEntry.followeeHandle,
      },
    });
    const response = await this.client.send(command);
    console.log(response);
  }

  async getFollowEntry(
    userAlias: string,
    followee: string
  ): Promise<FollowEntry | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        [this.followerAttribute]: userAlias,
        [this.followeeAttribute]: followee,
      },
    });
    const response = await this.client.send(command);
    console.log(response);

    if (response.Item) {
      let item = response.Item;
      return new FollowEntry(
        item[this.followerAttribute],
        item[this.followeeAttribute],
        item[this.followerName],
        item[this.followeeName]
      );
    } else {
      return null;
    }
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastItem: FollowEntry | null
  ): Promise<DataPage<FollowEntry>> {
    const command = new QueryCommand({
      TableName: this.tableName,
      Limit: pageSize,
      KeyConditionExpression: `${this.followerAttribute} = :h`,
      ExclusiveStartKey:
        lastItem == null
          ? undefined
          : {
              [this.followerAttribute]: lastItem.followerHandle,
              [this.followeeAttribute]: lastItem.followeeHandle,
            },
      ExpressionAttributeValues: {
        ":h": followerHandle,
      },
    });
    const response = await this.client.send(command);
    console.log(response);

    const followees: FollowEntry[] = [];
    if (response.Items) {
      for (let item of response.Items) {
        followees.push(
          new FollowEntry(
            item[this.followerAttribute],
            item[this.followeeAttribute],
            item[this.followerName],
            item[this.followeeName]
          )
        );
      }
    }

    let lastFollowEntry: FollowEntry | null = null;

    const lastKey = response.LastEvaluatedKey;
    if (lastKey) {
      lastFollowEntry = {
        followerHandle: lastKey[this.followerAttribute],
        followeeHandle: lastKey[this.followeeAttribute],
        followerName: lastKey[this.followerName],
        followeeName: lastKey[this.followeeName],
      };
    }
    return new DataPage(followees, lastFollowEntry);
  }

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastItem: FollowEntry | null
  ): Promise<DataPage<FollowEntry>> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      KeyConditionExpression: `${this.followeeAttribute} = :h`,
      ExclusiveStartKey:
        lastItem == null
          ? undefined
          : {
              [this.followerAttribute]: lastItem.followerHandle,
              [this.followeeAttribute]: lastItem.followeeHandle,
            },
      ExpressionAttributeValues: {
        ":h": followeeHandle,
      },
    });
    const response = await this.client.send(command);
    console.log(response);

    const followers: FollowEntry[] = [];
    if (response.Items) {
      for (let item of response.Items) {
        followers.push(
          new FollowEntry(
            item[this.followerAttribute],
            item[this.followeeAttribute],
            item[this.followerName],
            item[this.followeeName]
          )
        );
      }
    }

    let lastFollowEntry: FollowEntry | null = null;

    const lastKey = response.LastEvaluatedKey;
    if (lastKey) {
      lastFollowEntry = {
        followerHandle: lastKey[this.followerAttribute],
        followeeHandle: lastKey[this.followeeAttribute],
        followerName: lastKey[this.followerName],
        followeeName: lastKey[this.followeeName],
      };
    }
    return new DataPage(followers, lastFollowEntry);
  }

  async getFollowers(followeeHandle: string) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: `${this.followeeAttribute} = :h`,
      ExpressionAttributeValues: {
        ":h": followeeHandle,
      },
    });
    const response = await this.client.send(command);
    console.log(response);

    const followers: FollowEntry[] = [];
    if (response.Items) {
      for (let item of response.Items) {
        followers.push(
          new FollowEntry(
            item[this.followerAttribute],
            item[this.followeeAttribute],
            item[this.followerName],
            item[this.followeeName]
          )
        );
      }
    }
    return followers;
  }

  async getFollowees(followerHandle: string) {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: `${this.followerAttribute} = :h`,
      ExpressionAttributeValues: {
        ":h": followerHandle,
      },
    });
    const response = await this.client.send(command);
    console.log(response);

    const followers: FollowEntry[] = [];
    if (response.Items) {
      for (let item of response.Items) {
        followers.push(
          new FollowEntry(
            item[this.followerAttribute],
            item[this.followeeAttribute],
            item[this.followerName],
            item[this.followeeName]
          )
        );
      }
    }
    return followers;
  }

  async deleteFollowEntry(follower: FollowEntry) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        [this.followerAttribute]: follower.followerHandle,
        [this.followeeAttribute]: follower.followeeHandle,
      },
    });
    const response = await this.client.send(command);
    console.log(response);
  }

  async getFollowerCount(alias: string): Promise<number> {
    let lastItem: Record<string, any> | null = null;
    let numberOfFollowers = 0;
    do {
      const followersPage = await this.getPageOfFollowers(alias, 100, lastItem);
      numberOfFollowers += followersPage.values.length;
    } while (lastItem);
    return numberOfFollowers;
  }

  async getFolloweeCount(alias: string): Promise<number> {
    let lastItem: Record<string, any> | null = null;
    let numberOfFollowees = 0;
    do {
      const followeesPage = await this.getPageOfFollowees(alias, 100, lastItem);
      numberOfFollowees += followeesPage.values.length;
    } while (lastItem);
    return numberOfFollowees;
  }
}
