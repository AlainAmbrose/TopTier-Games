import React, { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../components/Authorizations/AuthContext"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import { buildPath } from "../utils/utils";

const SignUpPage = () => {
  const authContext = useContext(AuthContext);
  let firstname;
  let lastname;
  let login;
  let password;
  let email;

  // Now you can access values from the context
  const {
    user,
    isAuthenticated,
    userSignup,
    userLogin,
    userLogout,
    showSuperToast,
  } = authContext;

  const navigate = useNavigate();

  const checkValidEntries = async (event) => {
    event.preventDefault();
    // isValid = api call
    let js_username = JSON.stringify({ login: login.value });
    let js_email = JSON.stringify({ email: email.value });
    let response_username = await fetch(buildPath("Users/api/checkusername"), {
      method: "POST",
      credentials: "include",
      body: js_username,
      headers: { "Content-Type": "application/json" },
    });

    let response_email = await fetch(buildPath("Users/api/checkemail"), {
      method: "POST",
      credentials: "include",
      body: js_email,
      headers: { "Content-Type": "application/json" },
    });

    if (!response_username.ok || !response_email.ok) {
      showSuperToast(
        "Cannot check username and email!",
        "Cannot check username and email!"
      );
    }

    let res_username = await response_username.json();

    let res_email = await response_email.json();

    let isUsernameValid = false;
    let isEmailValid = false;

    if (res_username !== null && res_username.isUsernameValid !== null)
      isUsernameValid = res_username.isUsernameValid;
    if (res_email !== null && res_email.isEmailValid !== null)
      isEmailValid = res_email.isEmailValid;

    if (res_username.isUsernameValid && res_email.isEmailValid) {
      handleUserLogin(event, firstname, lastname, login, password, email);
    } else {
      if (!isUsernameValid && !isEmailValid) {
        showSuperToast(
          "Username and Email are taken!",
          "Username and Email are taken!"
        );
      } else if (!isUsernameValid) {
        showSuperToast("Username is taken!", "Username is taken!");
      } else {
        showSuperToast("Email is taken!", "Email is taken!");
      }
    }
  };

  const handleUserLogin = (
    event,
    firstname,
    lastname,
    login,
    password,
    email
  ) => {
    event.preventDefault();

    const passwordStrength = zxcvbn(password.value);

    if (passwordStrength.score < 2) {
      const feedback = passwordStrength.feedback.suggestions.join(" ");
      showSuperToast(`Password is too weak: ${feedback}`, "Password too weak");
      return;
    }
    var user = {
      firstname: firstname.value,
      lastname: lastname.value,
      login: login.value,
      password: password.value,
      email: email.value,
    };
    console.log("firstname: " + firstname);
    console.log("lastname: " + lastname);
    console.log("login: " + login);
    let signUpUser = JSON.stringify(user);
    localStorage.setItem("temp_user_data", signUpUser);
    console.log("made it to user login!");
    navigate("/auth/false");
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <div className="absolute inset-0 -z-20 h-full w-full object-cover bg-black opacity-60"></div>
      <img
        src="https://heroku-resources.s3.amazonaws.com/LandingPageBG.jpg"
        alt=""
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />
      <form
        className="space-y-6"
        action="#"
        onSubmit={(event) => checkValidEntries(event)}
      >
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign up for a new account
        </h2>
        <div>
          <label
            htmlFor="firstname"
            className="block text-sm font-medium leading-6 text-white"
          >
            First Name
          </label>
          <div className="mt-2">
            <input
              id="firstname"
              required
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              ref={(c) => (firstname = c)}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="lastname"
            className="block text-sm font-medium leading-6 text-white"
          >
            Last Name
          </label>
          <div className="mt-2">
            <input
              id="lastname"
              required
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              ref={(c) => (lastname = c)}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-white"
          >
            Email
          </label>
          <div className="mt-2">
            <input
              id="email"
              required
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              ref={(c) => (email = c)}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="lastname"
            className="block text-sm font-medium leading-6 text-white"
          >
            Login
          </label>
          <div className="mt-2">
            <input
              id="login"
              required
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              ref={(c) => (login = c)}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="lastname"
            className="block text-sm font-medium leading-6 text-white"
          >
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              required
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              ref={(c) => (password = c)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            // onClick={(event) => userSignup(event, firstname, lastname, login, password, email, toast)}
          >
            Sign up
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUpPage;
