import React from "react";
import { useState } from "react";

import LoginButton from "../components/LoginButton";
import SignUpButton from "../components/SignUpButton";

const LandingPage = () => {
  return (
    <div className="bg-black overflow-hidden">

  
      <main className="overflow-hidden">
        {/* Hero section */}
        <div className="relative isolate overflow-hidden h-screen  bg-gray-900 pb-16 pt-40 sm:pb-40">
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute w-full ml-96 h-[150%]  rotate-[25deg] origin-bottom-right bg-gradient-to-b from-white to-transparent opacity-75"></div>
          </div>
          <div className="absolute inset-0 -z-20 h-full w-full object-cover bg-black opacity-60">
          </div> 
          <img
            src="https://heroku-resources.s3.amazonaws.com/LandingPageBG.jpg"
            alt=""
            className="absolute inset-0 -z-30 h-full w-full object-cover"
          />
          <div className="relative z-50 mx-auto ml-0 mt-20 my-auto lg:px-24  ">
            <div className="mx-auto  ml-10  relative flex flex-row justify-between">
              <div className="w-fit mt-0">
                <h1 className="font-bold text-9xl italic tracking-tight text-white sm:text-6xl">
                  Top Tier
                </h1>
                <p className="mt-20 text-4xl italic leading-8 text-gray-300">
                  Power up
                </p>
              </div>
              <div className="flex flex-col w-fit mt-60 z-20 space-y-4 pr-48">
                <LoginButton></LoginButton>
                <SignUpButton></SignUpButton>
              </div>
            </div>
          </div>    
    
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-0 bg-gray-900" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Solutions</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.solutions.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.support.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.company.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.legal.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
