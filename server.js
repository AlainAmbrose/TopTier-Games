const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

<<<<<<< HEAD
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URL;

=======
>>>>>>> bc26c75ebadcae98f9b2e21e9a8fa33cb1622350
require('dotenv').config();

const path = require("path");
const PORT = process.env.PORT || 5001;
const uri = process.env.MONGODB_URL;

const usersRouter = require('./controllers/Users');

mongoose.connect(uri);

const app = express();

app.set('port', (process.env.PORT || 5001));

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

if (process.env.NODE_ENV === 'production')
{

    app.use(express.static(path.join(__dirname, 'frontend/build')));
    app.get('*', (req, res) =>
    {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

app.listen(PORT, () =>
{
    console.log('Server listening on port ' + PORT);
});

app.use('/Users/', usersRouter);