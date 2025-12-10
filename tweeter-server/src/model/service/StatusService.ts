import { StatusDto, UserDto } from "tweeter-shared";
import { StoryDAO } from "../dao/StoryDAO";
import { FeedDAO } from "../dao/FeedDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { FollowEntry } from "../dao/FollowEntry";
import { UserDAOFactory } from "./UserService";
import { UserDAO } from "../dao/UserDAO";
import { UserBatch } from "../../lambda/status/UserBatch";

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
  userDAO: UserDAO;
  constructor(
    feedDAOFactory: FeedDAOFactory,
    storyDAOFactory: StoryDAOFactory,
    followDAOFactory: FollowDAOFactory,
    userDAOFactory: UserDAOFactory
  ) {
    this.storyDAO = storyDAOFactory.make();
    this.feedDAO = feedDAOFactory.make();
    this.followDAO = followDAOFactory.make();
    this.userDAO = userDAOFactory.make();
  }

  public getStoryItems = async (
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], StatusDto | null]> => {
    const [statuses, newLastItem] = await this.storyDAO.getPageOfStories(
      userAlias,
      pageSize,
      lastItem
    );
    return [statuses, newLastItem];
  };
  public getFeedItems = async (
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], StatusDto | null]> => {
    const [statuses, newLastItem] = await this.feedDAO.getPageOfFeed(
      userAlias,
      pageSize,
      lastItem
    );
    return [statuses, newLastItem];
  };

  public postStoryStatus = async (status: StatusDto): Promise<void> => {
    await this.storyDAO.putStoryEntry(
      status.user.alias,
      status.timestamp,
      status.post
    );
  };

  public postBatch = async (userBatch: UserBatch): Promise<void> => {
    for (let user of userBatch.users) {
      await this.feedDAO.putFeedEntry(
        user.alias,
        userBatch.status.timestamp,
        userBatch.status.post,
        userBatch.status.user.alias
      );
    }
  };

  public postStatus = async (newStatus: StatusDto): Promise<void> => {
    const user = newStatus.user;
    const followers: UserDto[] = [];
    let hasMore = false;
    let lastItem: FollowEntry | null = null;

    await this.storyDAO.putStoryEntry(
      user.alias,
      newStatus.timestamp,
      newStatus.post
    );

    do {
      const dataPage = await this.followDAO.getPageOfFollowers(
        user.alias,
        10,
        lastItem
      );
      for (let followEntry of dataPage.values) {
        const [userDto, password] = await this.userDAO.getUser(
          followEntry.followerHandle
        );
        followers.push(userDto!);
      }
      lastItem = dataPage.lastKey;
      hasMore = dataPage.hasMorePages;
    } while (hasMore);

    for (let follower of followers) {
      await this.feedDAO.putFeedEntry(
        follower.alias,
        newStatus.timestamp,
        newStatus.post,
        user.alias
      );
    }
  };
}
