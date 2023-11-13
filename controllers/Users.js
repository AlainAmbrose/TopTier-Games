var express = require("express");
var router = express.Router();

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
        return 'http://localhost:3001/' + route;
    }
}


// Sign up for users
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

    return res.status(200).json({ id: newUser._id, message: "User created successfully." });
}));

router.post("/api/login", async (req, res) =>
{
    // Find user with requested email
    let user = await User.findOne({ Login: req.body.login });

    if (user === null)
    {
        return res.status(400).json({ id: -1, message: "User not found.", });
    }
    else
    {
        if (await user.validatePassword(req.body.password))
        {
            user.DateLastLoggedIn = new Date();
            await user.save();

            return res.status(200).json({ id: user._id, message: "User Successfully Logged In", });
        } else
        {
            return res.status(400).json({ id: -1, message: "Incorrect Password", });
        }
    }
});

router.post("/api/getuser", async (req, res) =>
{
    // Find user with requested email
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
            idd: user._id,
            firstname: user.FirstName,
            lastname: user.LastName,
            message: "User Successful",
        });
    }
});


router.post("/api/updateuser", async (req, res) =>
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
});

router.post("/api/deleteuser", async (req, res) =>
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

});

module.exports = router;
