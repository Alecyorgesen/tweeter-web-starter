import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../hooks/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginPresenter, LoginView } from "../../presenters/LoginPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();

  const listener: LoginView = {
    setIsLoading: setIsLoading,
    alias: alias,
    password: password,
    rememberMe: rememberMe,
    originalUrl: props.originalUrl,
    updateUserInfo: updateUserInfo,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage,
  };

  const presenter = useRef<LoginPresenter | null>(null);
  if (!presenter.current) {
    presenter.current = props.presenter ?? new LoginPresenter(listener);
  }
  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      presenter.current!.login(alias, password);
    }
  };

  const inputFieldFactory = () => {
    return (
      <>
        <AuthenticationFields
          _id="aliasInput"
          _placeHolder="name@example.com"
          _onKeydown={loginOnEnter}
          _onChange={setAlias}
          labelText="Alias"
        />
        <AuthenticationFields
          _id="passwordInput"
          _placeHolder="Password"
          _onKeydown={loginOnEnter}
          _onChange={setPassword}
          labelText="Password"
        />
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={() => presenter.current!.login(alias, password)}
    />
  );
};

export default Login;
