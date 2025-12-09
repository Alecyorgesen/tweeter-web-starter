import { Buffer } from "buffer";
import { User, AuthToken } from "tweeter-shared";
import { AuthView } from "./AuthView";
import { Presenter } from "./Presenter";

export interface RegisterView extends AuthView {
  firstName: string;
  lastName: string;
  imageBytes: Uint8Array;
  imageFileExtension: string;
}

export class RegisterPresenter extends Presenter<RegisterView> {
  constructor(view: RegisterView) {
    super(view);
  }

  register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> => {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(imageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const [user, authToken] = await this.userService.register(
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64,
      imageFileExtension
    );

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, authToken];
  };

  doRegister = async () => {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await this.register(
          this.view.firstName,
          this.view.lastName,
          this.view.alias,
          this.view.password,
          this.view.imageBytes,
          this.view.imageFileExtension
        );

        this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);
        this.view.navigate(`/feed/${user.alias}`);
      },
      "register user",
      async () => this.view.setIsLoading(false)
    );
  };
}
