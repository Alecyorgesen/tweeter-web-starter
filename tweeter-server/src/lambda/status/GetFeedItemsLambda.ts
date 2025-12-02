import { TweeterResponse, PagedItemRequest, StatusDto, PagedItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
  const statusService = new StatusService();
  const [statuses, hasMore] = await statusService.getFeedItems(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );
  return {
    success: true,
    message: null,
    items: statuses,
    hasMore: hasMore
  }
};