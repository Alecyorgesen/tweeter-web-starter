import { StatusDto } from "tweeter-shared";
import { DataPage } from "./DataPage";

export interface StoryDAO {
  putStoryEntry: (
    alias: string,
    timestamp: number,
    post: string,
  ) => Promise<void>;

  getPageOfStories: (
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ) => Promise<[StatusDto[], StatusDto | null]>;
}
