import react, { useState } from "react";

function LoginButton() {
  const doLogin = async (event) => {
    event.preventDefault();
    window.location.href = "/login";
  };
  return (
    <div id="loginButtonDiv">
      <form>
        <input
          type="submit"
          id="loginButton"
          className="buttons login-button"
          value="Login"
          onClick={doLogin}
        />
      </form>
    </div>
  );
}
export default LoginButton;
