import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { View } from "./Presenter";

export interface AuthView extends View {
  setIsLoading: (value: React.SetStateAction<boolean>) => void;
  alias: string;
  password: string;
  rememberMe: boolean;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: NavigateFunction;
}
