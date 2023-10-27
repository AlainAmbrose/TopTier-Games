import React, { useState } from "react";

const LoginPage = () => {
  var loginName;
  var loginPassword;

  const [message, setMessage] = useState("");
  const doActualLogin = async (event) => {
    event.preventDefault();

    var obj = { login: loginName.value, password: loginPassword.value };
    var js = JSON.stringify(obj);

    try {
      const response = await fetch(
        "https://poosd-large-project-group-8-1502fa002270.herokuapp.com/Users/api/login",
        {
          method: "POST",
          body: js,
          headers: { "Content-Type": "application/json" },
        }
      );
      var res = JSON.parse(await response.text());
      if (res.id <= 0) {
        setMessage(res.message);
      } else {
        var user = {
          id: res.id,
        };
        localStorage.setItem("user", JSON.stringify(user));
        setMessage(res.message);
        console.log(message);
        window.location.href = "/library";
      }
    } catch (e) {
      alert(e.toString());
      return;
    }
  };

  return (
    <div id="loginDiv">
      <form onSubmit={doActualLogin}>
        <span id="inner-title">Sign in?</span>
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
          value="Sign In"
          onClick={doActualLogin}
        />
      </form>
    </div>
  );
};

export default LoginPage;
