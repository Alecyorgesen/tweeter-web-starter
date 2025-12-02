import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../services/FollowService";
import { Presenter, View } from "./Presenter";
import { MessageView } from "./View";

export interface UserInfoComponentView extends MessageView {
  isFollower: boolean;
  setIsFollower: React.Dispatch<React.SetStateAction<boolean>>;
  followeeCount: number;
  setFolloweeCount: React.Dispatch<React.SetStateAction<number>>;
  followerCount: number;
  setFollowerCount: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: User | null;
  displayedUser: User | null;
  authToken: AuthToken | null;
}

export class UserInfoComponentPresenter extends Presenter<UserInfoComponentView> {
  setIsFollowerStatus = async (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) => {
    this.doFailureReportingOperation(
      async () => {
        if (currentUser === displayedUser) {
          this.view.setIsFollower(false);
        } else {
          this.view.setIsFollower(await this.followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          ));
        }
      },
      "determine follower status",
    );
  };

  setNumbFollowees = async (authToken: AuthToken, displayedUser: User) => {
    this.doFailureReportingOperation(
      async () => {
        this.view.setFolloweeCount(await this.followService.getFolloweeCount(
          authToken,
          displayedUser
        ));
      },
      "get followees count",
    );
  };
  setNumbFollowers = async (authToken: AuthToken, displayedUser: User) => {
    this.doFailureReportingOperation(
      async () => {
        this.view.setFollowerCount(await this.followService.getFollowerCount(
          authToken,
          displayedUser
        ));
      },
      "get followers count",
    );
  };

  followDisplayedUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    var followingUserToast = "";
    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true)
        followingUserToast = this.view.displayInfoMessage(
          `Following ${this.view.displayedUser!.name}...`,
          0
        );

        await this.followService.follow(
          this.view.authToken!,
          this.view.currentUser!.alias,
          this.view.displayedUser!.alias
        );

        this.view.setIsFollower(true);
        this.view.setFollowerCount(await this.followService.getFollowerCount(
          this.view.authToken!,
          this.view.currentUser!
        ));
        this.view.setFolloweeCount(await this.followService.getFolloweeCount(
          this.view.authToken!,
          this.view.currentUser!
        ));
      },
      "follow user",
      async () => {
        this.view.deleteMessage(followingUserToast);
        this.view.setIsLoading(false);
      }
    );
  };

  unfollowDisplayedUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    var unfollowingUserToast = "";
    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        unfollowingUserToast = this.view.displayInfoMessage(
          `Unfollowing ${this.view.displayedUser!.name}...`,
          0
        );

        await this.followService.unfollow(
          this.view.authToken!,
          this.view.currentUser!.alias,
          this.view.displayedUser!.alias
        );

        this.view.setIsFollower(false);
        this.view.setFollowerCount(await this.followService.getFollowerCount(this.view.authToken!, this.view.currentUser!));
        this.view.setFolloweeCount(await this.followService.getFolloweeCount(this.view.authToken!, this.view.currentUser!));
      },
      "unfollow user",
      async () => {
        this.view.deleteMessage(unfollowingUserToast);
        this.view.setIsLoading(false);
      }
    );
  };
}
