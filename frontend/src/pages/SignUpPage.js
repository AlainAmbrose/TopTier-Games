import React, { useState } from "react";

const SignUpPage = () => {
  var firstName;
  var lastName;
  var login;
  var password;
  var email;

  const [message, setMessage] = useState("");
  const doActualSignIn = async (event) => {
    event.preventDefault();

    var obj = {
      firstname: firstName.value,
      lastname: lastName.value,
      login: login.value,
      password: password.value,
      email: email.value,
    };
    var js = JSON.stringify(obj);

    try {
      const response = await fetch(
        "https://poosd-large-project-group-8-1502fa002270.herokuapp.com/Users/api/signup",
        {
          method: "POST",
          body: js,
          headers: { "Content-Type": "application/json" },
        }
      );
      var res = JSON.parse(await response.text());
      if (res.message === "User created successfully.") {
        var user = {
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
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
    <div id="signUpDiv">
      <form onSubmit={doActualSignIn}>
        <span id="inner-title">Sign Up?</span>
        <br />
        <input
          type="text"
          id="firstName"
          placeholder="First Name"
          ref={(c) => (firstName = c)}
        />
        <br />
        <input
          type="text"
          id="lastName"
          placeholder="Last Name"
          ref={(c) => (lastName = c)}
        />
        <br />
        <input
          type="text"
          id="login"
          placeholder="Login"
          ref={(c) => (login = c)}
        />
        <br />
        <input
          type="text"
          id="email"
          placeholder="Email"
          ref={(c) => (email = c)}
        />
        <br />
        <input
          type="password"
          id="password"
          placeholder="Password"
          ref={(c) => (password = c)}
        />
        <br />
        <input
          type="submit"
          id="signUpButton"
          className="buttons"
          value="Sign Up"
          onClick={doActualSignIn}
        />
      </form>
    </div>
  );
};

export default SignUpPage;
