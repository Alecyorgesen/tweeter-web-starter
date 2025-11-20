import { FollowService } from "../services/FollowService";
import { StatusService } from "../services/StatusService";
import { UserService } from "../services/UserService";

export interface View {
  displayErrorMessage: (message: string) => void;
}

export abstract class Presenter<V extends View> {
  protected view: V;
  protected constructor(view: V) {
    this.view = view;
  }
  protected _userService = new UserService();
  protected _statusService = new StatusService();
  protected _followService = new FollowService();

  public get statusService() {
    return this._statusService;
  }
  public get userService() {
    return this._userService;
  }
  public get followService() {
    return this._followService;
  }
  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    finallyOperation?: () => Promise<void>
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    } finally {
      if (finallyOperation !== undefined) {
        await finallyOperation();
      }
    }
  }
}
