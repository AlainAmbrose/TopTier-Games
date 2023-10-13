const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);
client.connect();

const path = require("path");
const PORT = process.env.PORT || 5000;

const app = express();

app.set('port', (process.env.PORT || 5000));

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

    app.use(express.static('frontend/build'));
    app.get('*', (req, res) =>
    {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

app.listen(PORT, () =>
{
    console.log('Server listening on port ' + PORT);
});

app.post('/api/login', async (req, res, next) =>
{
    var error = '';
    const { login, password } = req.body;
    const db = client.db();

    try
    {

        const results = await db.collection('Users').find({ Login: login, Password: password }).toArray();

        var id = -1;
        var fn = '';
        var ln = '';
        if (results.length > 0)
        {
            id = results[0]._id;
            fn = results[0].FirstName;
            ln = results[0].LastName;
        }

        db.collection('Users').updateOne({ _id: id }, { $currentDate: { DateLastLoggedIn: true } }, true, true);
    }
    catch (e)
    {
        error = e.toString();
    }

    if (id == -1)
        var ret = { id: id, firstName: fn, lastName: ln, error: 'Incorrect Login/Password' };
    else
        var ret = { id: id, firstName: fn, lastName: ln, error: error };

    res.status(200).json(ret);
});

app.post('/api/signup', async (req, res, next) =>
{
    var error = '';
    const { login, password, firstname, lastname, email } = req.body;
    const db = client.db();

    try
    {
        const result = db.collection('Users').insertOne({
            Login: login,
            Password: password,
            FirstName: firstname,
            LastName: lastname,
            DateCreated: new Date(),
            DateLastLoggedIn: new Date(),
            Email: email
        });
    }
    catch (e)
    {
        error = e.toString();
    }

    var ret = { error: error };
    res.status(200).json(ret);
});