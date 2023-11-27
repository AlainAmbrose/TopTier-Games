const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");
function secure() {
  if (process.env.NODE_ENV === "production") {
    return true;
  } else {
    return false;
  }
}

const refreshToken = async (req, res) => {
  const accessExpirationTime = 60 * 60 * 1000; // 15 minutes in milliseconds
  let cookies = req.cookies;

  if (!cookies?.jwt_refresh)
    return res.sendStatus(401).json({ message: "No refresh token" });

  const refreshToken = cookies.jwt_refresh;
  let user = await User.findOne({ RefreshToken: refreshToken });

  if (!user) return res.status(403).json({ message: "User not found" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user._id.toString() !== decoded.userId)
      return res.status(403).json({ message: "Can not decode userId" });
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Access token created @refreshToken");
    if (secure()) {
      console.log("Secure mode @refreshToken ");
      res.clearCookie("jwt_access");
      res.cookie("jwt_access", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: accessExpirationTime,
        path: "/",
      });
    } else {
      console.log("Insecure mode @refreshToken");
      res.clearCookie("jwt_access");
      res.cookie("jwt_access", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: accessExpirationTime,
        path: "/",
      });
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const accessTokenExpiryTime =
      currentTimeInSeconds + accessExpirationTime / 1000; // 15 minutes added to the current time
    return res.status(200).json({ exp: accessTokenExpiryTime });
  });
};
module.exports = { refreshToken };
