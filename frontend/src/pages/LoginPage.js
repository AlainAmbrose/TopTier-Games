import React, { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../components/Authorizations/AuthContext"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  let loginName;
  let loginPassword;

  // Now you can access values from the context
  const { user, isAuthenticated, userSignup, userLogin, userLogout } =
    authContext;

  const handleForgotPassword = (event) => {
    event.preventDefault();
    navigate("/auth/true");
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
        onSubmit={(event) => userLogin(event, loginName, loginPassword, toast)}
      >
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign in to your account
        </h2>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-white"
          >
            Username
          </label>
          <div className="mt-2">
            <input
              id="username"
              name="username"
              required
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              ref={(c) => (loginName = c)}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-white"
            >
              Password
            </label>
            <div className="text-sm">
              <button
                href="#"
                className="font-semibold text-green-400 hover:text-green-300"
                onClick={(event) => handleForgotPassword(event)}
              >
                Forgot password?
              </button>
            </div>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              ref={(c) => (loginPassword = c)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            // onClick={(event) => userLogin(event, loginName, loginPassword, toast)}
          >
            Sign in
          </button>
          <ToastContainer />
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
