import { useMessageActions } from "./MessageHooks";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { AuthToken, User } from "tweeter-shared";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import { useContext } from "react";
import { UserInfoActionsContext } from "../userInfo/UserInfoContexts";
import { UserService } from "../services/UserService";

const navigateToUser = async (
  event: React.MouseEvent,
  featurePath: string,
  authToken: AuthToken | null,
  displayedUser: User | null,
  setDisplayedUser: Function,
  navigate: NavigateFunction,
  displayErrorMessage: Function
): Promise<void> => {
  event.preventDefault();
  try {
    const alias = extractAlias(event.target.toString());

    const toUser = await getUser(authToken!, alias);

    if (toUser) {
      if (!toUser.equals(displayedUser!)) {
        setDisplayedUser(toUser);
        navigate(`/${featurePath}/${toUser.alias}`);
      }
    }
  } catch (error) {
    displayErrorMessage(`Failed to get user because of exception: ${error}`);
  }
};

const extractAlias = (value: string): string => {
  const index = value.indexOf("@");
  return value.substring(index);
};

const getUser = async (
  authToken: AuthToken,
  alias: string
): Promise<User | null> => {
  // TODO: Replace with the result of calling server
  return new UserService().getUser(authToken, alias);
};

export const useUserNavigation = (featurePath: string) => {
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useContext(UserInfoActionsContext);
  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions();
  return (event: React.MouseEvent): Promise<void> =>
    navigateToUser(
      event,
      featurePath,
      authToken,
      displayedUser,
      setDisplayedUser,
      navigate,
      displayErrorMessage
    );
};
