import { StatusDto } from "tweeter-shared";
import { DataPage } from "./DataPage";

export interface FeedDAO {
  putFeedEntry: (
    alias: string,
    timestamp: number,
    post: string
  ) => Promise<void>;

  getPageOfFeed: (
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ) => Promise<[StatusDto[], StatusDto | null]>;
}
