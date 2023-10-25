const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = mongoose.Schema({
    Login: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    DateCreated: {
        type: Date,
        required: true
    },
    DateLastLoggedIn: {
        type: Date,
        required: true
    },
    Email: {
        type: String,
        required: true
    }
}, { collection: 'Users' });

UserSchema.methods.createHash = async function (password)
{
    this.salt = crypto.randomBytes(16).toString('hex');

    this.Password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = async function (password)
{
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.Password === hash;
};

UserSchema.methods.getId = function ()
{
    return this._id;
};

UserSchema.methods.getFirstName = function ()
{
    return this.FirstName;
};

UserSchema.methods.getLastName = function ()
{
    return this.LastName;
};

UserSchema.methods.getEmail = function ()
{
    return this.Email;
};

const User = module.exports = mongoose.model("User", UserSchema);