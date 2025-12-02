import { AuthToken, Status, FakeData, StatusDto } from "tweeter-shared";

export class StatusService {
  public getStoryItems = async (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> => {
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const statusesDto = statuses.map((status) => status.dto);
    return [statusesDto, hasMore];
  };
  public getFeedItems = async (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> => {
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const statusesDto = statuses.map((status) => status.dto);
    return [statusesDto, hasMore];
  };

  public postStatus = async (
    token: string,
    newStatus: StatusDto
  ): Promise<void> => {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  };
}
