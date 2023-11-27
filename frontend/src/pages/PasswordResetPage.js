import React, { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../components/Authorizations/AuthContext"; // Adjust the path as necessary
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { buildPath } from "../utils/utils";
import zxcvbn from "zxcvbn";

const PasswordResetPage = () => {
  const authContext = useContext(AuthContext);
  const { showSuperToast } = authContext;
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  console.log(localStorage.getItem("user_email"));

  if (localStorage.getItem("user_email") !== null) {
    var user_email = localStorage.getItem("user_email");
    var userEmail = JSON.parse(user_email);
    console.log("Made it to local storage check");
  }

  async function resetPassword() {
    const passwordStrength = zxcvbn(newPassword);

    if (passwordStrength.score < 2) {
      const feedback = passwordStrength.feedback.suggestions.join(" ");
      showSuperToast(`Password is too weak: ${feedback}`, "Password too weak");
      return;
    }
    console.log("Resetting password with password:", newPassword);
    var obj = {
      emailFlag: true,
      verifyEmail: userEmail.email,
      password: newPassword,
    };
    console.log(userEmail.email);
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath("Users/api/updateuser"), {
        method: "POST",
        body: js,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showSuperToast("Can't reset password!", "Can't reset password!");
      }
      navigate("/login");
    } catch (e) {
      console.error(`Error thrown when resetting password: ${e}`);
      throw e; // Rethrow the error for React Query to catch
    }
  }

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
          Reset Your Password
        </h2>
        <h3 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Please enter the new Password
        </h3>
        <div>
          <label
            htmlFor="AuthCode"
            className="block text-sm font-medium leading-6 text-white"
          >
            New Password
          </label>
          <div className="mt-2">
            <input
              id="newPass"
              name="newPass"
              required
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button
            className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            onClick={() => resetPassword()}
          >
            Reset
          </button>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
