import "./UserInfoComponent.css";
import { useContext, useRef } from "react";
import { UserInfoContext, UserInfoActionsContext } from "./UserInfoContexts";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMessageActions } from "../hooks/MessageHooks";
import { UserInfoComponentPresenter } from "../presenters/UserInfoComponentPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayInfoMessage, displayErrorMessage, deleteMessage } =
    useMessageActions();

  const { currentUser, authToken, displayedUser } = useContext(UserInfoContext);
  const { setDisplayedUser } = useContext(UserInfoActionsContext);
  const navigate = useNavigate();
  const location = useLocation();
  const listener = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    deleteMessage: deleteMessage,
    isFollower: isFollower,
    setIsFollower: setIsFollower,
    followeeCount: followeeCount,
    setFolloweeCount: setFolloweeCount,
    followerCount: followerCount,
    setFollowerCount: setFollowerCount,
    isLoading: isLoading,
    setIsLoading: setIsLoading,
    currentUser: currentUser,
    displayedUser: displayedUser,
    authToken: authToken,
  };

  const presenter = useRef<UserInfoComponentPresenter | null>(null);
  // if (!presenter.current) {
  presenter.current = new UserInfoComponentPresenter(listener);
  // }

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    presenter.current!.setIsFollowerStatus(
      authToken!,
      currentUser!,
      displayedUser!
    );
    presenter.current!.setNumbFollowees(authToken!, displayedUser!);
    presenter.current!.setNumbFollowers(authToken!, displayedUser!);
  }, [displayedUser]);

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
    navigate(`${getBaseUrl()}/${currentUser!.alias}`);
  };

  const getBaseUrl = (): string => {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${currentUser.alias}`}
                    onClick={switchToLoggedInUser}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={presenter.current.unfollowDisplayedUser}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={presenter.current.followDisplayedUser}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
