import { set } from "mongoose";
import React, { createContext, useEffect, useState } from "react";
import { ToastContainer, toast as superToast } from "react-toastify";
export const AuthContext = createContext();

function buildPath(route) {
  if (process.env.NODE_ENV === "production") {
    return "https://www.toptier.games/" + route;
  } else {
    return "http://localhost:3001/" + route;
  }
}

const showLoginToast = (toast) => {
  toast.error("Username or Password is Incorrect", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "dark",
  });
};

const showSignUpToast = (missingValue, toast) => {
  toast.error("Sign Up Unsuccessful: " + missingValue + " is Missing", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "dark",
  });
};

const showSuperToast = (message, id) => {
  superToast.info(message, {
    toastId: id,
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "dark",
  });
};

// Login, logout, signup, refresh-token do not need credentials: 'include'
export const AuthProvider = ({ children, navigate }) => {
  const [user, setUser] = useState(null); // This can be used to store important user data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  let inactivityTimeout;

  // Event listeners for user actions
  window.addEventListener("mousemove", setUserActive);
  window.addEventListener("keydown", setUserActive);
  window.addEventListener("click", setUserActive);

  const userLogin = async (event, loginName, loginPassword, toast) => {
    event.preventDefault();

    var obj = { login: loginName.value, password: loginPassword.value };
    var js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath("Users/api/login"), {
        method: "POST",
        body: js,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        var res = JSON.parse(await response.text());
        var user = {
          id: res.id,
          firstname: res.firstname,
          lastname: res.lastname,
          username: obj.login,
          password: obj.password,
          email: res.email,
        };
        console.log("User has logged in.================");
        localStorage.setItem("user_data", JSON.stringify(user));
        scheduleTokenRefresh(res.exp);
        setIsAuthenticated(true);
        console.log(
          "isAuthenticated: ",
          isAuthenticated,
          localStorage.getItem("user_data")
        );

        setUser(user);

        navigate("/home");
      } else {
        showLoginToast(toast);
      }
    } catch (e) {
      return;
    }
  };

  const userSignup = async (
    // event,
    firstname,
    lastname,
    login,
    password,
    email,
    toast
  ) => {
    // event.preventDefault();
    let allFieldsFilled = true;
    console.log("firstname", firstname, typeof firstname);
    console.log("lastname", lastname, typeof lastname);
    console.log("Login", login, typeof login);
    console.log("password", password, typeof password);
    console.log("email", email, typeof email);

    var obj = {
      firstname: firstname,
      lastname: lastname,
      login: login,
      password: password,
      email: email,
    };

    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
      if (obj[keys[i]] === "") {
        allFieldsFilled = false;
        showSignUpToast(keys[i], toast);
        break;
      }
    }

    if (allFieldsFilled) {
      var js = JSON.stringify(obj);
      try {
        let response = await fetch(buildPath("Users/api/signup"), {
          method: "POST",
          body: js,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        response = await response.text();
        var res = JSON.parse(response);
        if (res.message === "User Successfully Created") {
          var user = {
            id: res.id,
            firstname: res.firstname,
            lastname: res.lastname,
            username: obj.login,
            email: obj.email,
          };
          localStorage.setItem("user_data", JSON.stringify(user));
          setUser(user);
          navigate("/login");
        } else {
          console.log(res.message);
        }
      } catch (e) {
        alert(e.toString());
        return;
      }
    }
  };

  const userLogout = async (route = "/login") => {
    try {
      if (
        isAuthenticated &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup" &&
        window.location.pathname !== "/"
      ) {
        const response = await fetch(buildPath("Users/api/logout"), {
          method: "GET",
          credentials: "include",
        });
        setUser(null);
        setIsAuthenticated(false);
        console.log("@userLogout Status: ", response.status);
        navigate(route);
      } else {
        navigate(route);
        console.log(
          "==================",
          isAuthenticated,
          window.location.pathname !== "/login",
          window.location.pathname !== "/signup",
          window.location.pathname !== "/"
        );
        console.log("Navigating to login page...");
      }

      if (localStorage.getItem("user_data") !== null) {
        console.log("clearing local storage================");
        localStorage.removeItem("user_data");
        console.log(
          "===============localStorage: ",
          localStorage.getItem("user_data")
        );
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  function scheduleTokenRefresh(expiryTimeInSeconds) {
    console.log(
      "Scheduling token refresh... expires in:",
      expiryTimeInSeconds,
      "seconds."
    );
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    console.log("Current time:", currentTimeInSeconds);
    const timeUntilExpiry = expiryTimeInSeconds - currentTimeInSeconds;
    console.log("Time until expiry:", timeUntilExpiry, "seconds.");
    console.log(
      "Token refresh scheduled. Expires in:",
      timeUntilExpiry / 60,
      "minutes."
    );

    // Set a buffer time, e.g., refresh the token 5 minutes before it expires
    const bufferTime = 5 * 60;
    const refreshTime = Math.max(0, timeUntilExpiry - bufferTime) * 1000;

    setTimeout(() => {
      console.log("Refreshing token...");
      refreshToken();
    }, refreshTime);
  }

  async function refreshToken() {
    if (isAuthenticated) {
      try {
        const response = await fetch("Refresh", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          // Optionally, the server can send the new token's expiry time in the response
          const { exp: expiryTime } = await response.json();

          scheduleTokenRefresh(expiryTime);
        } else {
          // Handle refresh failure, e.g., redirect to login
          showSuperToast("Session Expired", "session-expired");
          userLogout();
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        // Handle errors
      }
    } else {
      showSuperToast("Session Expired", "session-expired");
      userLogout();
    }
  }

  function setUserActive() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      showSuperToast("Inactivity Timeout", "inactivity-timeout");
      userLogout();
    }, 10 * 60 * 1000); // 10 minutes of inactivity
  }

  const contextValue = {
    user,
    isAuthenticated,
    userSignup,
    userLogin,
    userLogout,
    showSuperToast,
  };

  return (
    <>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
      <ToastContainer />
    </>
  );
};

export default AuthProvider;
