import React from "react";

import Login from "../components/Login";
import SignUp from "../components/SignUp";
import LandingPageTitle from "../components/SignUp";

const LoginPage = () => {
  return (
    <div>
      <LandingPageTitle />
      <SignUp />
      <Login />
    </div>
  );
};

export default LoginPage;
