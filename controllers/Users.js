var express = require("express");
var router = express.Router();

const User = require("../models/User");

router.post("/api/signup", (async (req, res) =>
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

    return res.status(200).json({ message: "User created successfully.", });
})
);

router.post("/api/login", (async (req, res) =>
{
    // Find user with requested email
    let user = await User.findOne({ Login: req.body.login });

    if (user === null)
    {
        return res.status(400).json({ message: "User not found.", });
    } else
    {
        if (await user.validatePassword(req.body.password))
        {
            return res.status(200).json({ message: "User Successfully Logged In", });
        } else
        {
            return res.status(400).json({
                message: "Incorrect Password",
            });
        }
    }
})
);

module.exports = router;