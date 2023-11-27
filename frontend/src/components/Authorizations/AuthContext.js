import { set } from "mongoose";
import React, { createContext, useEffect, useState } from "react";
import { ToastContainer, toast as superToast } from "react-toastify";
import { buildPath } from "../../utils/utils";
import { min } from "lodash";
export const AuthContext = createContext();

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
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  let inactivityTimeout;
  let refreshTokenTimeout;

  useEffect(() => {
    // Function to set up event listeners
    const setupEventListeners = () => {
      window.addEventListener("mousemove", setUserActive);
      window.addEventListener("keydown", setUserActive);
      window.addEventListener("click", setUserActive);
    };

    // Function to clean up event listeners
    const cleanupEventListeners = () => {
      window.removeEventListener("mousemove", setUserActive);
      window.removeEventListener("keydown", setUserActive);
      window.removeEventListener("click", setUserActive);
    };

    // Set up event listeners
    setupEventListeners();
    reinitializeTokenRefresh();

    // Clean up event listeners on component unmount
    return () => {
      cleanupEventListeners();
      clearTimeout(refreshTokenTimeout);
      clearTimeout(inactivityTimeout);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

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
          isAuthenticated: true,
          token_expiry_time: res.exp,
        };
        console.warn("User has logged in.================");
        localStorage.setItem("user_data", JSON.stringify(user));
        scheduleTokenRefresh(res.exp);
        // setIsAuthenticated(true);
        console.warn(
          "isAuthenticated @UserLogin(): ",
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
            isAuthenticated: true,
            token_expiry_time: res.exp,
          };
          localStorage.setItem("user_data", JSON.stringify(user));
          scheduleTokenRefresh(res.exp);
          // setIsAuthenticated(true);
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
    console.warn("==========Initiating user logout...============");
    console.warn(
      "localStorage @userLogout(): ",
      localStorage.getItem("user_data")
    );
    let currentUser = localStorage.getItem("user_data");
    let userData = JSON.parse(currentUser);
    console.warn("USER DATA NOT AS JSON: ", userData);
    try {
      // If user is authenticated, log them out and clear local storage
      if (
        userData !== null &&
        userData.isAuthenticated !== false &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup" &&
        window.location.pathname !== "/"
      ) {
        console.warn("=================localStrage data exists===============");
        const response = await fetch(buildPath("Users/api/logout"), {
          method: "GET",
          credentials: "include",
        });
        setUser(null);

        console.warn("@userLogout Status: ", response.status);
      } else if (
        window.location.pathname !== "/login" ||
        window.location.pathname !== "/signup" ||
        window.location.pathname !== "/"
      ) {
        console.warn(
          "=================localStrage data is null==============="
        );
        console.warn(
          " Simply routing back to login",
          window.location.pathname !== "/login",
          window.location.pathname !== "/signup",
          window.location.pathname !== "/"
        );
      }

      if (userData !== null) {
        console.warn("===============clearing local storage================");
        console.warn(
          "localStorage before clearing: ",
          localStorage.getItem("user_data")
        );
        localStorage.removeItem("user_data");
        console.warn(
          "localStorage after clearing: ",
          localStorage.getItem("user_data")
        );
        setUser(null);
        console.warn("User has logged out.");
      }

      clearTimeout(refreshTokenTimeout);
      clearTimeout(inactivityTimeout);
      console.warn("Navigating to login page...");
      navigate(route);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  function scheduleTokenRefresh(expiryTimeInSeconds) {
    console.warn(
      "Scheduling token refresh... expires in:",
      expiryTimeInSeconds,
      "seconds."
    );
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    console.warn("Current time:", currentTimeInSeconds);
    const timeUntilExpiry = expiryTimeInSeconds - currentTimeInSeconds;
    console.warn("Time until expiry:", timeUntilExpiry, "seconds.");
    console.warn("Access Token Expires in:", timeUntilExpiry / 60, "minutes.");

    // Set a buffer time, e.g., refresh the token 5 minutes before it expires
    const bufferTime = 5 * 60;
    const refreshTime = Math.max(0, timeUntilExpiry - bufferTime) * 1000;

    // Calculate the future time when the token will be refreshed
    const refreshAt = new Date(Date.now() + refreshTime);

    // Format the time for display
    const formattedTime = refreshAt.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    console.warn("Refreshing token at: ", formattedTime);

    refreshTokenTimeout = setTimeout(() => {
      console.warn("Refreshing token...");
      refreshToken();
    }, refreshTime);
  }

  // Function to refresh the token specifically when Login is successful
  async function refreshToken() {
    console.warn(
      "localStorage @refreshToken(): ",
      localStorage.getItem("user_data")
    );
    try {
      const response = await fetch(buildPath("Refresh"), {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        // Optionally, the server can send the new token's expiry time in the response
        const { exp: expiryTime } = await response.json();

        scheduleTokenRefresh(expiryTime);
      } else {
        console.warn("Response was not 200:", response.status);
        // Handle refresh failure, e.g., redirect to login
        showSuperToast("Session Expired", "session-expired");
        userLogout();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      // Handle refresh failure, e.g., redirect to login
      showSuperToast("Session Expired", "session-expired");
      userLogout();
    }
  }

  // Function to reinitialize token refresh timer on app load or refresh
  function reinitializeTokenRefresh() {
    console.warn(
      "====================reinitializeTokenRefresh()====================="
    );
    let currentUser = localStorage.getItem("user_data");
    let userData = JSON.parse(currentUser);
    console.warn(
      "USER DATA NOT AS JSON @reinitializeTokenRefresh(): ",
      userData
    );

    if (userData !== null && userData.token_expiry_time !== null) {
      const expiryTimeInSeconds = userData.token_expiry_time;
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = expiryTimeInSeconds - currentTimeInSeconds;
      if (timeUntilExpiry > 0) {
        scheduleTokenRefresh(expiryTimeInSeconds);
      } else {
        // Token is already expired, handle accordingly
        console.warn("Token is already expired, logging out...");
        userLogout();
      }
    }
  }

  function setUserActive() {
    clearTimeout(inactivityTimeout);
    console.warn(
      "User is active, at:",
      new Date().toLocaleTimeString(),
      "Resetting inactivity timeout..."
    );
    inactivityTimeout = setTimeout(() => {
      showSuperToast("Inactivity Timeout", "inactivity-timeout");
      console.warn("Inactive for 10 mintutes", new Date().toLocaleTimeString());
      userLogout();
    }, 10 * 60 * 1000); // 10 minutes of inactivity
  }

  // Return True if user is Authorized and False if not
  const checkUser = async () => {
    let currentUser = localStorage.getItem("user_data");
    let userData = JSON.parse(currentUser);
    console.warn("USER DATA NOT AS JSON @checkuser(): ", userData);

    if (userData === null) {
      console.warn("!!!!User is not authenticated @checkUser()!!!!");
      return false;
    } else if (
      userData === false ||
      userData.token_expiry_time < Math.floor(Date.now() / 1000)
    ) {
      console.warn(
        "user is not authenticated @checkUser() userData: ",
        userData,
        "userData.isAuthenticated: ",
        userData.isAuthenticated === false,
        "userData.token_expiry_time expired? : ",
        userData.token_expiry_time < Math.floor(Date.now() / 1000)
      );
      return false;
    }
    console.warn(
      "User is authenticated @checkUser(): ",
      localStorage.getItem("user_data")
    );
    return true;
  };

  const contextValue = {
    user,
    userSignup,
    userLogin,
    userLogout,
    showSuperToast,
    checkUser,
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
