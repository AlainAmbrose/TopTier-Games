const express = require("express");
const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = require("../models/User");


const app_name = "poosd-large-project-group-8-1502fa002270";
function buildPath(route)
{
    if (process.env.NODE_ENV === 'production')
    {
        return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else
    {
        return 'http://localhost:3000/' + route;
    }
}

const refreshToken = async (req, res) =>
{
    let cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    let user = await User.findOne({ RefreshToken: refreshToken });

    if (!user) return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) =>
        {
            if (err || user.Login !== decoded.login) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { 'login': decoded.login },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m' }
            );

            res.status(200).json({accessToken});
        }
    );
};

module.exports = { refreshToken };
