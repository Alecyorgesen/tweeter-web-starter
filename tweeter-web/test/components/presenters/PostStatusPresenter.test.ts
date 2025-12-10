import { ServerFacade } from "../../../src/components/server/ServerFacade";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../../src/components/presenters/PostStatusPresenter";
import {
  AuthenticationRequest,
  PagedItemRequest,
  Status,
} from "tweeter-shared";
import "isomorphic-fetch";
import { instance, mock, verify, anything, spy } from "@typestrong/ts-mockito";

describe("PostStatusPresenter", () => {
  const serverFacade = new ServerFacade();

  it("logs in a user, creates a post, makes sure the displayInfoMessage is called, and retrieves the story", async () => {
    const request: AuthenticationRequest = {
      token: "",
      alias: "a",
      password: "a",
    };
    const [user, authToken] = await serverFacade.login(request);

    expect(user).toBeDefined();
    expect(authToken).toBeDefined();
    const post = "This is a post";

    const listener: PostStatusView = {
      setLoadingFalse: () => {},
      setLoadingTrue: () => {},
      post: post,
      currentUser: user,
      authToken: authToken,
      setPostToEmptyString: () => {},
      displayInfoMessage: (
        message: string,
        duration: number,
        bootstrapClasses?: string | undefined
      ) => "string",
      displayErrorMessage: (
        message: string,
        bootstrapClasses?: string | undefined
      ) => "string",
      deleteMessage: (messageId: string) => {},
    };
    const listenerSpy = spy(listener);
    const postStatusPresenter = new PostStatusPresenter(listenerSpy);
    await postStatusPresenter.postStatus(authToken, post, user!);
    await new Promise((f) => setTimeout(f, 2000));

    verify(listenerSpy.displayInfoMessage("Successfully Posted!", 2000));

    const request2: PagedItemRequest<Status> = {
      pageSize: 1,
      lastItem: null,
      userAlias: user!.alias,
      token: authToken.token,
    };

    const [statuses, lastItem, hasmore] = await serverFacade.getStoryItems(
      request2
    );
    expect(statuses.length).toBe(1);
    const retrievedStatus = statuses[0];
    expect(retrievedStatus.post).toEqual(post);
    expect(retrievedStatus.user).toEqual(user);
  }, 15000);
});
