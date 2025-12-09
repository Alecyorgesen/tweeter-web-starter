import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { Status, User } from "tweeter-shared";
import { FeedScrollerPresenter } from "./components/presenters/FeedScrollerPresenter";
import { ItemScrollerView } from "./components/presenters/ItemScrollerPresenter";
import StatusItem from "./components/item/StatusItem";
import UserItem from "./components/item/UserItem";
import { StoryScrollerPresenter } from "./components/presenters/StoryScrollerPresenter";
import { FolloweeScrollerPresenter } from "./components/presenters/FolloweeScrollerPresenter";
import { FollowerScrollerPresenter } from "./components/presenters/FollowerScrollerPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
        <Route
          path="feed/:displayedUser"
          element={
            <ItemScroller<Status>
              key={1}
              featurePath="feed"
              presenterFactory={(view: ItemScrollerView<Status>) =>
                new FeedScrollerPresenter(view)
              }
              itemFactory={(props: { item: Status; featurePath: string }) =>
                StatusItem(props)
              }
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <ItemScroller<Status>
              key={2}
              featurePath="story"
              presenterFactory={(view: ItemScrollerView<Status>) =>
                new StoryScrollerPresenter(view)
              }
              itemFactory={(props: { item: Status; featurePath: string }) =>
                StatusItem(props)
              }
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <ItemScroller<User>
              key={3}
              featurePath="followees"
              presenterFactory={(view: ItemScrollerView<User>) =>
                new FolloweeScrollerPresenter(view)
              }
              itemFactory={(props: { item: User; featurePath: string }) =>
                UserItem(props)
              }
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <ItemScroller<User>
              key={4}
              featurePath="followers"
              presenterFactory={(view: ItemScrollerView<User>) =>
                new FollowerScrollerPresenter(view)
              }
              itemFactory={(props: { item: User; featurePath: string }) =>
                UserItem(props)
              }
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route
          path="*"
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
