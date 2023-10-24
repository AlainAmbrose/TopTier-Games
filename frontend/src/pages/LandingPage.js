import React from "react";
import { useState } from 'react'

import LoginButton from "../components/LoginButton";
import SignUpButton from "../components/SignUpButton";
import LandingPageTitle from "../components/LandingPageTitle";


const LandingPage = () =>  {

  return (
    <div className="bg-black">
      <main>
        {/* Hero section */}
        <div className="relative isolate overflow-hidden bg-gray-900 pb-16 pt-80 sm:pb-40">
          <img
            src="https://heroku-resources.s3.amazonaws.com/LandingPageBG.jpg"
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="mr-auto ml-0 max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
              <div className="text-left">
                <h1 className="font-bold text-9xl italic tracking-tight text-white sm:text-6xl">
                  Top Tier 
                </h1>
                <p className="mt-20 text-4xl italic leading-8 text-gray-300">
                  Power up
                </p>
                <div className="absolute inset-0 -z-10 h-full w-full object-cover bg-black opacity-60">
                </div>
              </div>
            </div>
          </div>     
        </div>
      </main>
    </div>
  )
}


export default LandingPage;