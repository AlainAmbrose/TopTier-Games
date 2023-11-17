const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = require("../models/User");
function secure()
{
    if (process.env.NODE_ENV === 'production')
    {
        return true;
    }
    else
    {
        return false;
    }
}

const refreshToken = async (req, res) =>
{
    let cookies = req.cookies;

    if (!cookies?.jwt_refresh) return res.sendStatus(401);

    const refreshToken = cookies.jwt_refresh;
    let user = await User.findOne({ RefreshToken: refreshToken });

    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) =>
        {
            if (err || user._id.toString() !== decoded.userId) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { 'userId': decoded.userId },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            if (secure())
            {
                res.clearCookie('jwt_access');
                res.cookie('jwt_access', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
            }
            else
            {
                res.clearCookie('jwt_access');
                res.cookie('jwt_access', accessToken, { httpOnly: true, sameSite: 'strict', maxAge: 15 * 60 * 1000 });
            }

            return res.status(200).json({exp: Math.floor(Date.now() / 1000),});
        }
    );
};

module.exports = { refreshToken };
