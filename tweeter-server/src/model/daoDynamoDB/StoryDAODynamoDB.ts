import { StoryDAO } from "../dao/StoryDAO";
import { StatusDto } from "tweeter-shared";
import { StatusDAODynamoDB } from "./StatusDAODynamoDB";

export class StoryDAODynamoDB extends StatusDAODynamoDB implements StoryDAO {
  readonly tableName = "story";
  readonly aliasAttribute = "user_alias";

  async putStoryEntry(
    alias: string,
    timestamp: number,
    post: string
  ): Promise<void> {
    return await this.putEntry(alias, timestamp, post, alias);
  }

  async getPageOfStories(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], StatusDto | null]> {
    return await this.getPage(alias, pageSize, lastItem);
  }
}
