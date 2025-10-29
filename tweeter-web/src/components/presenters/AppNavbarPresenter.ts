import { NavigateFunction } from "react-router-dom";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../services/UserService";
import { MessageView } from "./View";
import { Presenter } from "./Presenter";

export interface AppNavbarView extends MessageView {
  clearUserInfo: () => void;
  navigate: NavigateFunction;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  constructor(view: AppNavbarView) {
    super(view);
  }

  logOut = async (authToken: AuthToken | null) => {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
    await this.doFailureReportingOperation(async () => {
      await this.userService.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
  };
}
