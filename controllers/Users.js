const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const crypto = require("crypto");

function secure() {
  if (process.env.NODE_ENV === "production") {
    return true;
  } else {
    return false;
  }
}

// Sign up for users
const signUp = async (req, res) => {
  // email verification and password strength check

  const newUser = new User();
  newUser.Login = req.body.login;
  newUser.FirstName = req.body.firstname;
  newUser.LastName = req.body.lastname;
  newUser.DateCreated = new Date();
  newUser.DateLastLoggedIn = new Date();
  newUser.Email = req.body.email;

  newUser.createHash(req.body.password);
  await newUser.save();

  return res.status(200).json({
    id: newUser._id,
    firstname: newUser.FirstName,
    lastname: newUser.LastName,
    message: "User Successfully Created",
  });
};

const checkUsername = async (req, res) => {
  let user = await User.find({ Login: req.body.login });

  if (user === undefined) {
    return res.status(200).json({ isValid: true });
  } else {
    return res.status(200).json({ isValid: false });
  }
};

const sendAuthEmail = async (req, res) => {
  let authCode = crypto.randomBytes(10).toString("hex");

  if (secure()) {
    res.cookie("authCode", authCode, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 5 * 60 * 1000,
      path: "/",
    });
  } else {
    res.cookie("authCode", authCode, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 5 * 60 * 1000,
      path: "/",
    });
  }

  console.log(req.body.email);
  const msg = {
    to: req.body.email,
    from: "TopTierGames.ucf@gmail.com",
    subject: "Verify your email with TopTier Games!",
    text:
      "Hello " +
      req.body.firstname +
      ",\nCopy the verification code below to verify your email with TopTier Games:\n\n" +
      authCode +
      "\n\nThis code is valid for 5 minutes only.",
  };
  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
    return res.status(200).json({ message: "Email Sent Successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(400).json({ message: "Error Sending Email" });
  }
};

const verifyAuthCode = async (req, res) => {
  let cookies = req.cookies;

  if (!cookies?.authCode)
    return res.status(400).json({ message: "Resend Auth Code" });

  let authCode = cookies.authCode;

  console.log("cookies=====", authCode);
  console.log("request=====", req.body.authCode);

  if (authCode !== null && req.body.authCode == authCode) {
    return res.status(200).json({
      message: "Email Verified Successfully",
    });
  } else {
    return res.status(200).json({
      message: "Incorrect Authorization Code",
    });
  }
};

const login = async (req, res) => {
  const accessExpirationTime = 15 * 60 * 1000; // 15 minutes in milliseconds
  const refreshExpirationTime = 60 * 60 * 1000; // 1 hour in milliseconds
  let user = await User.findOne({ Login: req.body.login });

  if (user === null) {
    return res.sendStatus(403);
  } else {
    if (await user.validatePassword(req.body.password)) {
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );

      user.DateLastLoggedIn = new Date();
      user.RefreshToken = refreshToken;
      await user.save();
      console.log("Access token created @login");
      console.log("Refresh token created @login");
      if (secure()) {
        console.log("Secure mode @login");
        res.cookie("jwt_access", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: accessExpirationTime,
          path: "/",
        });
        res.cookie("jwt_refresh", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: refreshExpirationTime,
          path: "/",
        });
      } else {
        console.log("Insecure mode @login");
        res.cookie("jwt_access", accessToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: accessExpirationTime,
          path: "/",
        });
        res.cookie("jwt_refresh", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: refreshExpirationTime,
          path: "/",
        });
      }
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const accessTokenExpiryTime =
        currentTimeInSeconds + accessExpirationTime / 1000; // 15 minutes added to the current time
      return res.status(200).json({
        id: user._id,
        firstname: user.FirstName,
        lastname: user.LastName,
        email: user.Email,
        exp: accessTokenExpiryTime,
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "User Successfully Logged In",
      });
    } else {
      return res.sendStatus(401);
    }
  }
};

const sendPassResetEmail = async (req, res) => {
  let passResetCode = crypto.randomBytes(10).toString("hex");

  if (secure()) {
    res.cookie("passResetCode", passResetCode, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 5 * 60 * 1000,
      path: "/",
    });
  } else {
    res.cookie("passResetCode", passResetCode, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 5 * 60 * 1000,
      path: "/",
    });
  }

  const msg = {
    to: req.body.email,
    from: "TopTierGames.ucf@gmail.com",
    subject: "Password Reset Request from TopTier Games!",
    text:
      "Hello " +
      req.body.firstname +
      ",\nWe have recieved a request that you would like to reset your password. If this is accurate, enter the verification code below into TopTier Games to continue:\n\n" +
      passResetCode +
      "\n\nThis code is valid for 5 minutes only.",
  };

  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      return res.status(200).json({ message: "Email Sent Successfully" });
    })
    .catch((error) => {
      console.error(error);
      return res.status(400).json({ message: "Error Sending Email" });
    });
};

const resetPass = async (req, res) => {
  //verify passResetCode
  let cookies = req.cookies;
  if (!cookies?.passResetCode)
    return res.status(400).json({ message: "Resend password reset code." });

  let passResetCode = cookies.passResetCode;

  if (passResetCode === null || req.body.passResetCode !== passResetCode) {
    return res.status(400).json({
      message: "Incorrect Password Reset Code",
    });
  }

  //get user
  let user = await User.findOne({ _id: req.body.userId });

  if (user === null) {
    return res.status(400).json({
      message: "User not found.",
    });
  }

  //update password
  user.createHash(req.body.newassword);
  await user.save();

  return res.status(200).json({
    Login: user.Login,
    message: "Password successfully updated.",
  });
};

const getUser = async (req, res) => {
  let user = await User.findOne({ _id: req.body.id });

  if (user === null) {
    return res.status(400).json({
      id: -1,
      firstname: "",
      lastname: "",
      message: "User not found.",
    });
  } else {
    return res.status(200).json({
      id: user._id,
      firstname: user.FirstName,
      lastname: user.LastName,
      email: user.Email,
      message: "User Successful",
    });
  }
};

const updateUser = async (req, res) => {
  let newLogin = req.body.login;
  let newFirstName = req.body.firstname;
  let newLastName = req.body.lastname;
  let newEmail = req.body.email;

  let id = req.body.userId;

  let user = await User.findOne({ _id: id });

  if (user === null) {
    return res.status(400).json({ id: -1, message: "User not found." });
  } else {
    if (newLogin !== undefined) {
      user.Login = newLogin;
    }

    if (newFirstName !== undefined) {
      user.FirstName = newFirstName;
    }

    if (newLastName !== undefined) {
      user.LastName = newLastName;
    }

    if (newEmail !== undefined) {
      user.Email = newEmail;
    }

    await user.save();
    return res
      .status(200)
      .json({ id: 1, message: "User updated successfully." });
  }
};

const deleteUser = async (req, res) => {
  let userId = req.body.userId;
  let user = await User.findOne({ _id: userId });

  if (user === null) {
    return res.status(400).json({ id: -1, message: "Error: User not found." });
  } else {
    let result = await User.deleteOne({ _id: userId });
    if (result.deletedCount == 1) {
      return res
        .status(200)
        .json({ id: 1, message: "User deleted successfully." });
    } else {
      return res.status(400).json({
        id: -1,
        message: "Error: User deleted unsuccessfully, please try again.",
      });
    }
  }
};

const logout = async (req, res) => {
  let cookies = req.cookies;
  if (!cookies?.jwt_refresh) return res.sendStatus(401);

  const refreshToken = cookies.jwt_refresh;

  let user = await User.findOne({ RefreshToken: refreshToken });

  if (user !== undefined) {
    console.log("user found: ", user);
    user.RefreshToken = "";
    await user.save();
  }

  res.clearCookie("jwt_refresh");
  res.clearCookie("jwt_access");

  return res.sendStatus(200);
};

module.exports = {
  signUp,
  checkUsername,
  sendAuthEmail,
  verifyAuthCode,
  sendPassResetEmail,
  resetPass,
  login,
  updateUser,
  getUser,
  deleteUser,
  logout,
};
