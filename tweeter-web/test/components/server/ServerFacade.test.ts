import { ServerFacade } from "../../../src/components/server/ServerFacade";
import {
  PagedItemRequest,
  RegisterRequest,
  User,
  UserAliasRequest,
  UserDto,
} from "tweeter-shared";
import "isomorphic-fetch";

describe("ServerFacade", () => {
  let serverFacade = new ServerFacade();
  let allen: User;
  let amy: User;
  beforeEach(() => {
    allen = new User(
      "Allen",
      "Anderson",
      "@allen",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
    );
    amy = new User(
      "Amy",
      "Ames",
      "@amy",
      "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png"
    );
  });
  it("gets a user and authToken back", async () => {
    const imageData = Buffer.from("this is a picture", "utf8");
    const request: RegisterRequest = {
      firstName: "Allen",
      lastName: "Anderson",
      alias: "@allen",
      password: "password",
      userImageBytes: imageData as Uint8Array,
      imageFileExtension: "/something",
      token: "",
    };
    const [user, authToken] = await serverFacade.register(request);

    expect(user).toBeDefined();
    expect(user).toEqual(allen);
    expect(authToken).toBeDefined();
    expect(authToken.token).toEqual(expect.any(String));
    expect(authToken.timestamp).toEqual(expect.any(Number));
  });

  it("gets a page of followers", async () => {
    const request: PagedItemRequest<UserDto> = {
      token: "token",
      userAlias: "@bob",
      pageSize: 2,
      lastItem: null,
    };
    const [users, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(users).toBeDefined();
    expect(users.length).toBe(2);
    expect(users[0]).toEqual(allen);
    expect(users[1]).toEqual(amy);
    expect(hasMore).toBe(true);
  });

  it("gets the number of followees", async () => {
    const request: UserAliasRequest = {
      token: "token",
      userAlias: "@allen",
    };
    const followeeCount = await serverFacade.getFolloweeCount(request);
    expect(followeeCount).toEqual(expect.any(Number));
    expect(followeeCount).toBeGreaterThan(0);
  });
});
