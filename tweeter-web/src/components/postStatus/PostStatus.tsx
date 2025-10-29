import "./PostStatus.css";
import { useRef, useState } from "react";
import { AuthToken, Status } from "tweeter-shared";
import { useMessageActions } from "../hooks/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../presenters/PostStatusPresenter";

interface props {
  presenter?: PostStatusPresenter;
}

const PostStatus = (props: props) => {
  const { displayInfoMessage, displayErrorMessage, deleteMessage } =
    useMessageActions();

  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let listener: PostStatusView = {
    setIsLoading: setIsLoading,
    post: post,
    currentUser: currentUser,
    authToken: authToken,
    setPostToEmptyString: () => setPost(""),
    displayInfoMessage: displayInfoMessage,
    displayErrorMessage: displayErrorMessage,
    deleteMessage: deleteMessage,
  };

  const presenter = useRef<PostStatusPresenter | null>(null);
  if (!presenter.current) {
    presenter.current = props.presenter ?? new PostStatusPresenter(listener);
  }

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          aria-label="text box"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          aria-label="Post Status"
          type="button"
          disabled={checkButtonStatus()}
          style={{ width: "8em" }}
          onClick={() =>
            presenter.current!.postStatus(
              authToken,
              post,
              currentUser!
            )
          }
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatus()}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
