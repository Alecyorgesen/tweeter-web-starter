import {
  AuthenticationRequest,
  AuthenticationResponse,
  AuthToken,
  DisplayedUserRequest,
  IsFollowerResponse,
  PagedItemRequest,
  PagedItemResponse,
  PostStatusRequest,
  QuantityResponse,
  RegisterRequest,
  Status,
  StatusDto,
  TweeterRequest,
  TweeterResponse,
  User,
  UserAliasRequest,
  UserDto,
  UserResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://8zc5nkelab.execute-api.us-east-1.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], User | null, boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(request, "/follow/getFollowees");
    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, User.fromDto(response.lastItem), response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFollowers(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], User | null, boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(request, "/follow/getFollowers");
    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, User.fromDto(response.lastItem), response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getStoryItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], Status | null, boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(request, "/status/getStoryItems");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, Status.fromDto(response.lastItem), response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFeedItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], Status | null, boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(request, "/status/getFeedItems");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No feed items found`);
      } else {
        return [items, Status.fromDto(response.lastItem), response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async follow(request: DisplayedUserRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      DisplayedUserRequest,
      TweeterResponse
    >(request, "/follow/follow");

    // Handle errors
    if (response.success) {
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async unfollow(request: DisplayedUserRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      DisplayedUserRequest,
      TweeterResponse
    >(request, "/follow/unfollow");

    // Handle errors
    if (response.success) {
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status/postStatus");

    // Handle errors
    if (response.success) {
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFollowerCount(request: UserAliasRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserAliasRequest,
      QuantityResponse
    >(request, "/follow/getFollowerCount");

    // Handle errors
    if (response.success) {
      return response.amount;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFolloweeCount(request: UserAliasRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserAliasRequest,
      QuantityResponse
    >(request, "/follow/getFolloweeCount");

    // Handle errors
    if (response.success) {
      return response.amount;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getIsFollowerStatus(
    request: DisplayedUserRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      DisplayedUserRequest,
      IsFollowerResponse
    >(request, "/follow/getIsFollowerStatus");

    // Handle errors
    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getUser(request: UserAliasRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      UserAliasRequest,
      UserResponse
    >(request, "/user/getUser");

    // Handle errors
    if (response.success) {
      return User.fromDto(response.user);
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async login(
    request: AuthenticationRequest
  ): Promise<[User | null, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      AuthenticationRequest,
      AuthenticationResponse
    >(request, "/user/login");
    // Handle errors
    if (response.success) {
      if (response.user == null) {
        throw new Error("User doesn't exist?");
      } else {
        return [
          User.fromDto(response.user),
          new AuthToken(response.token, response.timestamp),
        ];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async register(
    request: RegisterRequest
  ): Promise<[User | null, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      AuthenticationResponse
    >(request, "/user/register");
    // Handle errors
    if (response.success) {
      if (response.user == null) {
        throw new Error("User doesn't exist?");
      } else {
        return [
          User.fromDto(response.user),
          new AuthToken(response.token, response.timestamp),
        ];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async logout(request: TweeterRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      TweeterRequest,
      TweeterResponse
    >(request, "/user/logout");
    // Handle errors
    if (response.success) {
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }
}
