import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify, anything } from "@typestrong/ts-mockito";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../../src/components/presenters/PostStatusPresenter";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, Status, User } from "tweeter-shared";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("Login Component", () => {
  const time = Date.now()
  const authToken = new AuthToken("dsds", time);
  const userPerson = new User("a", "b", "@a", "/");

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: userPerson,
      authToken: authToken,
    });
  });

  it("starts with the post status and clear buttons disabled", () => {
    const { user, postStatusButton, clearButton, textBox } =
      renderPostStatusAndGetElement();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", async () => {
    const { user, postStatusButton, clearButton, textBox } =
      renderPostStatusAndGetElement();
    await user.type(textBox, "heyheyhey");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons if the text field is cleared", async () => {
    const { user, postStatusButton, clearButton, textBox } =
      renderPostStatusAndGetElement();
    await user.type(textBox, "aaaa");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textBox);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();

    await user.type(textBox, "bbbb");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("it's presenter's postStatus method is called with the correct parameters when the post status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const text = "Yoyoyo";

    const { user, postStatusButton, clearButton, textBox } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    await user.type(textBox, text);
    await user.click(postStatusButton);


    verify(mockPresenter.postStatus(authToken, text, userPerson)).once();
  });
});

function renderLogin(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderLogin(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const textBox = screen.getByLabelText("text box");
  const clearButton = screen.getByRole("button", { name: /Clear/i });

  return { user, postStatusButton, clearButton, textBox };
}
