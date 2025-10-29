import { AuthToken, Status, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/components/presenters/PostStatusPresenter";
import {
  instance,
  mock,
  verify,
  spy,
  when,
  anything,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/components/services/StatusService";

describe("PostStatusPresenter", () => {
  let postStatusPresenter: PostStatusPresenter;
  let mockPostStatusView: PostStatusView;
  let mockStatusService: StatusService;
  const authToken = new AuthToken("CoolAuth", Date.now());
  const text = "hey there"
  const user = new User("First", "Last", "@your face", "/???");

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn("CoolestMessage");
    mockStatusService = mock<StatusService>();
    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(instance(mockPostStatusView))
    );
    when(postStatusPresenterSpy.statusService).thenReturn(
      instance(mockStatusService)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.postStatus(authToken, text, user);

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.postStatus(authToken, text, user);

    verify(mockStatusService.postStatus(authToken, anything())).once();
  });

  it("if the posting of status is successful, it clears the info message that was displayed previously, clears the post, and displays a status posted message", async () => {
    await postStatusPresenter.postStatus(authToken, text, user);

    verify(mockPostStatusView.deleteMessage("CoolestMessage")).once();
    verify(mockPostStatusView.setPostToEmptyString()).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
  });

  it("if the posting of the status in not successful, it tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message", async () => {
    let error = new Error("You got an error, bud");
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.postStatus(authToken, text, user);

    verify(mockPostStatusView.deleteMessage("CoolestMessage")).once();
    verify(mockPostStatusView.displayErrorMessage(`Failed to post status because of exception: ${error}`)).once()
    verify(mockPostStatusView.setPostToEmptyString()).never();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
  });
});
