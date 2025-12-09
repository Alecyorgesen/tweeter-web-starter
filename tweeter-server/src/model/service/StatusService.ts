import {
  StatusDto,
  UserDto,
} from "tweeter-shared";
import { StoryDAO } from "../dao/StoryDAO";
import { FeedDAO } from "../dao/FeedDAO";
import { FollowDAO } from "../dao/FollowDAO";

export interface FeedDAOFactory {
  make: () => FeedDAO;
}
export interface StoryDAOFactory {
  make: () => StoryDAO;
}

export interface FollowDAOFactory {
  make: () => FollowDAO;
}

export class StatusService {
  storyDAO: StoryDAO;
  feedDAO: FeedDAO;
  followDAO: FollowDAO;
  constructor(
    feedDAOFactory: FeedDAOFactory,
    storyDAOFactory: StoryDAOFactory,
    followDAOFactory: FollowDAOFactory
  ) {
    this.storyDAO = storyDAOFactory.make();
    this.feedDAO = feedDAOFactory.make();
    this.followDAO = followDAOFactory.make();
  }

  public getStoryItems = async (
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> => {
    return await this.storyDAO.getPageOfStories(userAlias, pageSize, lastItem);
  };
  public getFeedItems = async (
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> => {
    return await this.feedDAO.getPageOfFeed(userAlias, pageSize, lastItem);
  };

  public postStatus = async (newStatus: StatusDto): Promise<void> => {
    const user = newStatus.user;
    const followers: UserDto[] = [];
    let hasMore = false;
    let lastItem: UserDto | null = null;
    let nextFollowers: UserDto[] = [];

    await this.storyDAO.putStoryEntry(
      user.alias,
      newStatus.timestamp,
      newStatus.post
    );

    do {
      [nextFollowers, hasMore] = await this.followDAO.getPageOfFollowers(
        user.alias,
        10,
        lastItem
      );
      if (nextFollowers.length > 0) {
        lastItem = nextFollowers[nextFollowers.length - 1]!;
      }
      followers.push(...nextFollowers);
    } while (hasMore);

    for (let follower of followers) {
      await this.feedDAO.putFeedEntry(
        follower.alias,
        newStatus.timestamp,
        newStatus.post
      );
    }
  };
}
