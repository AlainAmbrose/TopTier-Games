import React from "react";
import "../App.css";

import LoginButton from "../components/LoginButton";
import SignUpButton from "../components/SignUpButton";
import LandingPageTitle from "../components/LandingPageTitle";

const LandingPage = () => {
  return (
    <div>
      <LandingPageTitle />
      <LoginButton />
      <SignUpButton />
    </div>
  );
};

export default LandingPage;
