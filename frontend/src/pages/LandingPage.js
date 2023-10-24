import React from "react";
<<<<<<< Updated upstream
<<<<<<< HEAD
import { useState } from 'react'
=======
import { useState } from "react";
>>>>>>> Stashed changes

import LoginButton from "../components/LoginButton";
import SignUpButton from "../components/SignUpButton";

const LandingPage = () => {
  return (
    <div className="bg-black">
      <main>
        {/* Hero section */}
        <div className="relative isolate overflow-hidden h-screen  bg-gray-900 pb-16 pt-40 sm:pb-40">
          <img
            src="https://heroku-resources.s3.amazonaws.com/LandingPageBG.jpg"
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="mx-auto ml-0 mt-20 my-auto lg:px-24  ">
            <div className="mx-auto  ml-10  relative flex flex-row justify-between">
              <div className="w-fit mt-0">
                <h1 className="font-bold text-9xl italic tracking-tight text-white sm:text-6xl">
                  Top Tier
                </h1>
                <p className="mt-20 text-4xl italic leading-8 text-gray-300">
                  Power up
                </p>
              </div>
              <div className="flex flex-col w-fit mt-60 space-y-4 pr-48">
                <LoginButton></LoginButton>
                <SignUpButton></SignUpButton>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 h-full w-full object-cover bg-black opacity-60"></div>
        </div>
      </main>
    </div>
  );
};

<<<<<<< Updated upstream

export default LandingPage;
=======
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
>>>>>>> bc26c75ebadcae98f9b2e21e9a8fa33cb1622350
=======
export default LandingPage;
>>>>>>> Stashed changes
