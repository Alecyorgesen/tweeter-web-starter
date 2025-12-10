import { StatusDto, UserDto } from "tweeter-shared";
import { StoryDAO } from "../dao/StoryDAO";
import { FeedDAO } from "../dao/FeedDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { FollowEntry } from "../dao/FollowEntry";
import { UserDAOFactory } from "./UserService";
import { UserDAO } from "../dao/UserDAO";

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
  ): Promise<[StatusDto[], boolean]> => {
    const [statuses, newLastItem] = await this.storyDAO.getPageOfStories(
      userAlias,
      pageSize,
      lastItem
    );
    return [statuses, newLastItem == null ? false : true];
  };
  public getFeedItems = async (
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> => {
    const [statuses, newLastItem] = await this.feedDAO.getPageOfFeed(
      userAlias,
      pageSize,
      lastItem
    );
    return [statuses, newLastItem == null ? false : true];
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
        const [userDto, password] = await this.userDAO.getUser(followEntry.followerHandle);
        followers.push(userDto!);
      }
      lastItem = dataPage.lastKey;
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
