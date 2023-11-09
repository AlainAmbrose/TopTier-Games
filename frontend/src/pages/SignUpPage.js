import React, { useState } from "react";


const app_name = "poosd-large-project-group-8-1502fa002270";
function buildPath(route)
{
  if (process.env.NODE_ENV === 'production')
  {
    return 'https://' + app_name + '.herokuapp.com/' + route;
  } else
  {
    return 'http://localhost:3000/' + route;
  }
}

const SignUpPage = () =>
{
  var firstName;
  var lastName;
  var login;
  var password;
  var email;

  const [message, setMessage] = useState("");
  const initSignUp = async (event) =>
  {
    event.preventDefault();

    var obj = {
      firstname: firstName.value,
      lastname: lastName.value,
      login: login.value,
      password: password.value,
      email: email.value,
    };
    var js = JSON.stringify(obj);

    try
    {
      const response = await fetch(buildPath("Users/api/signup"),
        {
          method: "POST",
          body: js,
          headers: { "Content-Type": "application/json" },
        }
      );
      var res = JSON.parse(await response.text());
      if (res.message === "User created successfully.")
      {
        var user = {
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage(res.message);
        console.log(message);
        window.location.href = "/home";
      }
    } catch (e)
    {
      alert(e.toString());
      return;
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
      <form className="space-y-6" action="#" onSubmit={initSignUp}>
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
              ref={(c) => (firstName = c)}
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
              ref={(c) => (lastName = c)}
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
            onClick={initSignUp}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
