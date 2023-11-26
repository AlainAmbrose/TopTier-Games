import React, { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../components/Authorizations/AuthContext"; // Adjust the path as necessary
import { useQuery } from "react-query";

const EmailAuthPage = () => {
  const authContext = useContext(AuthContext);
  const [isEnabled, setIsEnabled] = useState(true);
  const {
    user,
    isAuthenticated,
    userSignup,
    userLogin,
    userLogout,
    showSuperToast,
  } = authContext;
  const [authCode, setAuthCode] = useState("");

  console.log(localStorage.getItem("temp_user_data"));

  if (localStorage.getItem("temp_user_data") !== null) {
    var currentUser = localStorage.getItem("temp_user_data");
    var userData = JSON.parse(currentUser);
    console.log("Made it to local storage check");
  }

  function buildPath(route) {
    if (process.env.NODE_ENV === "production") {
      return "https://www.toptier.games/" + route;
    } else {
      return "http://localhost:3001/" + route;
    }
  }

  async function sendAuthEmail(email, firstname, caller) {
    // event.preventDefault();
    setIsEnabled(false);
    console.log("Sending auth email (sendAuthEmail) from: " + caller);
    console.log("ONSDFGVIOPSDBGNOSDIGBOSDGIBSDGOBSDIGOBSDOIGSDBGIOSDGB");
    var obj = { email: email, firstname: firstname };
    console.log("================Sending object");
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath("Users/api/sendAuthEmail"), {
        method: "POST",
        body: js,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showSuperToast(
          "Email Send Failed Please Try Again!",
          "Failed Email Send"
        );
      }
      const jsonResponse = await response.json();
      return jsonResponse.message; // Accessing the 'result' property
    } catch (e) {
      console.error(`Error thrown when sending auth email: ${e}`);
      throw e; // Rethrow the error for React Query to catch
    }
  }

  async function verifyAuthCode() {
    console.log("Verfying auth code (verifyAuthCode)", authCode);
    var obj = { authCode: authCode };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath("Users/api/verifyAuthCode"), {
        method: "POST",
        body: js,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showSuperToast("Incorrect Authorization Code!");
      }
      const jsonResponse = await response.json();
      return jsonResponse.message; // Accessing the 'result' property
    } catch (e) {
      console.error(`Error thrown when verifying auth code: ${e}`);
      throw e; // Rethrow the error for React Query to catch
    }
  }

  const {
    data: message,
    isLoading: isLoading,
    isError,
    error,
  } = useQuery(
    ["authMessage", userData.email, userData.firstname],
    () => sendAuthEmail(userData.email, userData.firstname, "useQuery"),
    { refetchOnWindowFocus: false, enabled: isEnabled }
  );

  const handleEmailVerification = async () => {
    // event.preventDefault();
    console.log("made it to handleEmailVerification");
    let message = await verifyAuthCode();
    console.log("This is the message: " + message);
    if (message === "Email Verified Successfully") {
      console.log(
        "Message was successful",
        userData.firstname,
        userData.lastname,
        userData.login,
        userData.password,
        userData.email
      );
      userSignup(
        userData.firstname,
        userData.lastname,
        userData.login,
        userData.password,
        userData.email,
        toast
      );
    } else {
      console.log("Message was not successful");
      showSuperToast("Incorrect Authorization Code!", "FailedAuthTast");
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <div className="absolute inset-0 -z-20 h-full w-full object-cover bg-black opacity-60"></div>
      <img
        src="https://heroku-resources.s3.amazonaws.com/LandingPageBG.jpg"
        alt=""
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />
      <div className="space-y-6">
        <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-white">
          Verify Your Email
        </h2>
        <h3 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Please enter the verification code we just sent to your email
        </h3>
        <div>
          <label
            htmlFor="AuthCode"
            className="block text-sm font-medium leading-6 text-white"
          >
            Authorization Code
          </label>
          <div className="mt-2">
            <input
              id="authCode"
              name="authCode"
              required
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button
            className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            onClick={() =>
              sendAuthEmail(userData.email, userData.firstname, "resendEmail")
            }
          >
            Resend Email
          </button>
          <button
            className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            onClick={() => handleEmailVerification()}
          >
            Submit
          </button>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default EmailAuthPage;
