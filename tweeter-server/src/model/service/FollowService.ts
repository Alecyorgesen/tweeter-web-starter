import { UserDto } from "tweeter-shared";
import { FollowDAO } from "../dao/FollowDAO";
import { FollowEntry } from "../dao/FollowEntry";
import { UserDAOFactory } from "./UserService";
import { UserDAO } from "../dao/UserDAO";

export interface FollowDAOFactory {
  make: () => FollowDAO;
}

export class FollowService {
  followDAO: FollowDAO;
  userDAO: UserDAO;

  constructor(
    followDAOFactory: FollowDAOFactory,
    userDAOFactory: UserDAOFactory
  ) {
    this.followDAO = followDAOFactory.make();
    this.userDAO = userDAOFactory.make();
  }
  getIsFollowerStatus = async (
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> => {
    const follow_entry = await this.followDAO.getFollowEntry(
      userAlias,
      selectedUserAlias
    );
    if (!follow_entry) {
      return false;
    }
    return true;
  };

  getFolloweeCount = async (userAlias: string): Promise<number> => {
    return await this.followDAO.getFolloweeCount(userAlias);
  };

  getFollowerCount = async (userAlias: string): Promise<number> => {
    return await this.followDAO.getFollowerCount(userAlias);
  };

  getFollowees = async (
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> => {
    let lastFollowEntry: FollowEntry | null = null;
    const userDtos: UserDto[] = [];
    if (lastItem) {
      lastFollowEntry = this.makeFollowEntry(userAlias, lastItem.alias);
    }
    const followeesPage = await this.followDAO.getPageOfFollowees(
      userAlias,
      pageSize,
      lastFollowEntry
    );

    for (let followEntry of followeesPage.values) {
      const [user, password] = await this.userDAO.getUser(
        followEntry.followeeHandle
      );
      userDtos.push(user);
    }

    return [userDtos, followeesPage.hasMorePages];
  };

  getFollowers = async (
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> => {
    let lastFollowEntry: FollowEntry | null = null;
    const userDtos: UserDto[] = [];
    if (lastItem) {
      lastFollowEntry = {
        followerHandle: lastItem.alias,
        followeeHandle: userAlias,
        followerName: "",
        followeeName: "",
      };
    }
    const followersPage = await this.followDAO.getPageOfFollowers(
      userAlias,
      pageSize,
      lastFollowEntry
    );

    for (let followEntry of followersPage.values) {
      const [user, password] = await this.userDAO.getUser(
        followEntry.followerHandle
      );
      userDtos.push(user);
    }

    return [userDtos, followersPage.hasMorePages];
  };

  follow = async (userAlias: string, followeeAlias: string) => {
    await this.followDAO.putFollowEntry(
      this.makeFollowEntry(userAlias, followeeAlias)
    );
  };
  unfollow = async (userAlias: string, followeeAlias: string) => {
    await this.followDAO.deleteFollowEntry(
      this.makeFollowEntry(userAlias, followeeAlias)
    );
  };
  makeFollowEntry(followerAlias: string, followeeAlias: string) {
    return {
      followerHandle: followerAlias,
      followeeHandle: followeeAlias,
      followerName: "",
      followeeName: "",
    };
  }
}
