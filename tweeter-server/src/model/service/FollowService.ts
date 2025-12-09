import { UserDto } from "tweeter-shared";
import { FollowDAO } from "../dao/FollowDAO";
import { FollowEntry } from "../dao/FollowEntry";
import { UserDAOFactory } from "./UserService";
import { UserDAO } from "../dao/UserDAO";
import { DataPage } from "../dao/DataPage";

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
    return await this.userDAO.getUserFollowersAmount(userAlias);
  };

  getFollowerCount = async (userAlias: string): Promise<number> => {
    return await this.userDAO.getUserFolloweesAmount(userAlias);
  };

  getFollowees = async (
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> => {
    return await this.getPeople(
      userAlias,
      pageSize,
      lastItem,
      this.followDAO.getPageOfFollowees,
      "followee"
    );
  };

  getPeople = async (
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
    getPage: (
      userAlias: string,
      pageSize: number,
      lastItem: FollowEntry | null
    ) => Promise<DataPage<FollowEntry>>,
    follow: string
  ): Promise<[UserDto[], boolean]> => {
    let lastFollowEntry: FollowEntry | null = null;
    const userDtos: UserDto[] = [];
    if (lastItem) {
      if (follow == "follower") {
        lastFollowEntry = this.makeFollowEntry(lastItem.alias, userAlias);
      } else if (follow == "followee") {
        lastFollowEntry = this.makeFollowEntry(userAlias, lastItem.alias);
      }
    }
    const followsPage = await getPage(userAlias, pageSize, lastFollowEntry);

    for (let followEntry of followsPage.values) {
      let handle: string;
      if (follow == "follower") {
        handle = followEntry.followerHandle;
      } else if (follow == "followee") {
        handle = followEntry.followeeHandle;
      } else {
        throw new Error("internal-server-error: mispelled something i reckon");
      }
      const [user, password] = await this.userDAO.getUser(handle);
      if (user == null) {
        throw Error("internal-server-error: user doesn't exist?");
      }
      userDtos.push(user);
    }

    return [userDtos, followsPage.hasMorePages];
  };

  getFollowers = async (
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> => {
    return await this.getPeople(
      userAlias,
      pageSize,
      lastItem,
      this.followDAO.getPageOfFollowees,
      "follower"
    );
  };

  follow = async (userAlias: string, followeeAlias: string) => {
    await this.followDAO.putFollowEntry(
      this.makeFollowEntry(userAlias, followeeAlias)
    );
    await this.userDAO.incrementFollowerCount(followeeAlias);
    await this.userDAO.incrementFolloweeCount(userAlias);
  };
  unfollow = async (userAlias: string, followeeAlias: string) => {
    await this.followDAO.deleteFollowEntry(
      this.makeFollowEntry(userAlias, followeeAlias)
    );
    await this.userDAO.decrementFollowerCount(followeeAlias);
    await this.userDAO.decrementFolloweeCount(userAlias);
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
