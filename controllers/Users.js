const express = require("express");
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


// Sign up for users
const signUp = async (req, res) =>
{
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

    return res.status(200).json({ id: newUser._id, message: "User created successfully." });
};

const login = async (req, res) =>
{
    let user = await User.findOne({ Login: req.body.login });

    if (user === null)
    {
        return res.sendStatus(403);
    }
    else
    {
        if (await user.validatePassword(req.body.password))
        {
            const accessToken = jwt.sign(
                { 'login': user.Login },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' });

            const refreshToken = jwt.sign(
                { 'login': user.Login },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '15m' });

            user.DateLastLoggedIn = new Date();
            user.RefreshToken = refreshToken;
            await user.save();

            if (secure())
            {
                res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 1 * 60 * 60 * 1000 });
            }
            else
            {
                res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 1 * 60 * 60 * 1000 });
            }
            return res.status(200).json({ accessToken, });
        } else
        {
            return res.status(401);
        }
    }
};

const getUser = async (req, res) =>
{
    let user = await User.findOne({ _id: req.body.id });

    if (user === null)
    {
        return res.status(400).json({
            id: -1,
            firstname: "",
            lastname: "",
            message: "User not found.",
        });
    }
    else
    {
        return res.status(200).json({
            id: user._id,
            firstname: user.FirstName,
            lastname: user.LastName,
            message: "User Successful",
        });
    }
};


const updateUser = async (req, res) =>
{
    let newLogin = req.body.login;
    let newPassword = req.body.password;
    let newFirstName = req.body.firstname;
    let newLastName = req.body.lastname;
    let newEmail = req.body.email;

    let id = req.body.userId;

    let user = await User.findOne({ _id: id });

    if (user === null)
    {
        return res.status(400).json({ id: -1, message: "User not found.", });
    }
    else
    {
        if (newLogin !== undefined)
        {
            user.Login = newLogin;
        }

        if (newFirstName !== undefined)
        {
            user.FirstName = newFirstName;
        }

        if (newLastName !== undefined)
        {
            user.LastName = newLastName;
        }

        if (newEmail !== undefined)
        {
            user.Email = newEmail;
        }

        if (newPassword !== undefined)
        {
            user.createHash(newPassword);
        }

        await user.save();
        return res.status(200).json({ id: 1, message: "User updated successfully.", });
    }
};

const deleteUser = async (req, res) =>
{
    let userId = req.body.userId;
    let user = await User.findOne({ _id: userId });

    if (user === null)
    {
        return res.status(400).json({ id: -1, message: "Error: User not found." });
    }
    else 
    {
        let result = await User.deleteOne({ _id: userId });
        if (result.deletedCount == 1)
        {
            return res.status(200).json({ id: 1, message: 'User deleted successfully.' });
        }
        else
        {
            return res.status(400).json({ id: -1, message: 'Error: User deleted unsuccessfully, please try again.' });
        }
    }

};

const logout = async (req, res) =>
{
    let cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    let user = await User.findOne({ RefreshToken: refreshToken });

    if (!user)
    {
        if (secure())
        {
            res.clearCookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });
        }
        else
        {
            res.clearCookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        }
        return res.sendStatus(200);
    }

    user.RefreshToken = '';
    await user.save();

    if (secure())
    {
        res.clearCookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });
    }
    else
    {
        res.clearCookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    }

    return res.sendStatus(200);
};

module.exports =
{
    signUp,
    login,
    updateUser,
    getUser,
    deleteUser,
    logout
};
