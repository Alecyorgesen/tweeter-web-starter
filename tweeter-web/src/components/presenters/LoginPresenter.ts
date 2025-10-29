import { User, AuthToken } from "tweeter-shared";
import { Presenter } from "./Presenter";
import { AuthView } from "./AuthView";

export interface LoginView extends AuthView {
  originalUrl: string | undefined;
}

export class LoginPresenter extends Presenter<LoginView> {
  constructor(view: LoginView) {
    super(view);
  }

  login = async (alias: string, password: string) => {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await this.userService.login(alias, password);

        if (user === null) {
          throw new Error("Invalid alias or password");
        }

        this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);

        if (!!this.view.originalUrl) {
          this.view.navigate(this.view.originalUrl);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      },
      "log user in",
      async () => this.view.setIsLoading(false)
    );
  };
}
