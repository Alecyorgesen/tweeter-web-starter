import { StatusDto } from "tweeter-shared";
import { FeedDAO } from "../dao/FeedDAO";
import { StatusDAODynamoDB } from "./StatusDAODynamoDB";

export class FeedDAODynamoDB extends StatusDAODynamoDB implements FeedDAO {
  readonly tableName = "feed";
  readonly aliasAttribute = "follower_alias";

  async putFeedEntry(
    alias: string,
    timestamp: number,
    post: string
  ): Promise<void> {
    return await this.putEntry(alias, timestamp, post);
  }

  async getPageOfFeed(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], StatusDto | null]> {
    return await this.getPage(alias, pageSize, lastItem);
  }
}
