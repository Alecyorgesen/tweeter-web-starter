import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";
import { UserAliasRequest } from "./UserAliasRequest";

export interface PagedItemRequest<T> extends TweeterRequest, UserAliasRequest {
  readonly pageSize: number;
  readonly lastItem: T | null;
}
