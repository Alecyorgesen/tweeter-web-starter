import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMessageActions } from "../hooks/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import {
  ItemScrollerPresenter,
  ItemScrollerView,
} from "../presenters/ItemScrollerPresenter";

interface Props<T> {
  featurePath: string;
  presenterFactory: (view: ItemScrollerView<T>) => ItemScrollerPresenter<T>;
  itemFactory: (props: ItemProperties<T>) => JSX.Element
}

interface ItemProperties<T> {
  item: T;
  featurePath: string
}

const ItemScroller = <T,>(props: Props<T>) => {
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);

  const listener = {
    addItems: (newItems: T[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayedUser: displayedUser,
    authToken: authToken,
    displayErrorMessage: displayErrorMessage,
  };

  const presenter: React.MutableRefObject<ItemScrollerPresenter<T> | null> = useRef(null);
  if (presenter.current === null) {
    presenter.current = props.presenterFactory(listener);
  }
  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      presenter!
        .current!.getUser(authToken!, displayedUserAliasParam!)
        .then((toUser) => {
          if (toUser) {
            setDisplayedUser(toUser);
          }
        });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    presenter.current = props.presenterFactory(listener);
    setItems(() => []);
    presenter!.current!.reset();
    presenter!.current!.loadMoreItems(null);
  }, [displayedUser]);

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() =>
          presenter!.current!.loadMoreItems(presenter!.current!.lastItem)
        }
        hasMore={presenter!.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <props.itemFactory item={item} featurePath={props.featurePath} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
