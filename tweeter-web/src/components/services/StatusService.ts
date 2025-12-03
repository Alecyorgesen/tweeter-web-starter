import {
  AuthToken,
  Status,
  StatusDto,
  PagedItemRequest,
  PostStatusRequest,
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
    return await this.serverFacade.getFeedItems(request);
  };

  public postStatus = async (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> => {
    const request: PostStatusRequest = {
      token: authToken.token,
      status: newStatus,
    };
    await this.serverFacade.postStatus(request);
  };
}
