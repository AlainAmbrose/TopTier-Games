import React from "react";

const LoginPage = () => {
  var loginName;
  var loginPassword;
  return (
    <div id="loginDiv">
      <form>
        <span id="inner-title">Log in?</span>
        <br />
        <input
          type="text"
          id="loginName"
          placeholder="Username"
          ref={(c) => (loginName = c)}
        />
        <br />
        <input
          type="password"
          id="loginPassword"
          placeholder="Password"
          ref={(c) => (loginPassword = c)}
        />
        <br />
        <input
          type="submit"
          id="loginButton"
          className="buttons"
          value="Do It"
        />
      </form>
    </div>
  );
};

export default LoginPage;
