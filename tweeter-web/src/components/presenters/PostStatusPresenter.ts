import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../services/StatusService";
import { Presenter, View } from "./Presenter";
import { MessageView } from "./View";

export interface PostStatusView extends MessageView {
  setIsLoading: (value: React.SetStateAction<boolean>) => void;
  post: string;
  currentUser: User | null;
  authToken: AuthToken | null;
  setPostToEmptyString: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  constructor(view: PostStatusView) {
    super(view);
  }

  postStatus = async (
    authToken: AuthToken | null,
    post: string,
    currentUser: User
  ): Promise<void> => {
    var postingStatusToastId = "";
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        postingStatusToastId = this.view.displayInfoMessage(
          "Posting status...",
          0
        );
        const status = new Status(post, currentUser!, Date.now());
        await this.statusService.postStatus(authToken!, status);

        this.view.setPostToEmptyString();
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post status",
      async () => {
        this.view.deleteMessage(postingStatusToastId);
        this.view.setIsLoading(false);
      }
    );
  };
}
