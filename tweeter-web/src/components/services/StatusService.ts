import {
  AuthToken,
  Status,
  FakeData,
  StatusDto,
  PagedItemRequest,
} from "tweeter-shared";
import { ServerFacade } from "../server/ServerFacade";

export class StatusService {
  serverFacade = new ServerFacade();
  public getStoryItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    const request: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return await this.serverFacade.getStoryItems(request);
  };
  public getFeedItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    const request: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    const [statuses, hasMore] = await this.serverFacade.getFeedItems(request);
    return [statuses, hasMore]
  };
  public postStatus = async (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> => {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  };
}
