import React from "react";

const SignUpPage = () => {
  var loginName;
  var loginPassword;
  return (
    <div id="loginDiv">
      <form>
        <span id="inner-title">Sign Up?</span>
        <br />
        <input
          type="text"
          id="signUpName"
          placeholder="Username"
          ref={(c) => (loginName = c)}
        />
        <br />
        <input
          type="password"
          id="signUpPassword"
          placeholder="Password"
          ref={(c) => (loginPassword = c)}
        />
        <br />
        <input
          type="submit"
          id="signUpButton"
          className="buttons"
          value="Do It"
        />
      </form>
    </div>
  );
};

export default SignUpPage;
