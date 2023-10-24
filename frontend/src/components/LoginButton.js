import react, { useState } from "react";

function LoginButton() {
  const doLogin = async (event) => {
    event.preventDefault();
    window.location.href = "/login";
  };


  return (
    <button
    type="button"
    className="rounded-full bg-white px-24 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={doLogin}
    >
      Sign Up
    </button>
  );
}
export default LoginButton;
