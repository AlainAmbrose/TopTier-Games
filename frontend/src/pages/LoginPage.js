import React, { useState } from "react";

const LoginPage = () => {
  var loginName;
  var loginPassword;

  const [message, setMessage] = useState("");
  const initLogin = async (event) => {
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
      <form onSubmit={initLogin}>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign in to your account
        </h2>
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
          onClick={initLogin}
        />
      </form>
    </div>
  );
};

export default LoginPage;
