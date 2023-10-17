import React from "react";

function Login() {
  var loginName;
  var loginPassword;
  return (
    <div id="loginDiv">
      <form>
        <span id="inner-title">LOG IN?</span>
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
        <input type="submit" id="loginButton" class="buttons" value="Do It" />
      </form>
    </div>
  );
}

export default Login;
