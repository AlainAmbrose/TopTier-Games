var express = require("express");
var router = express.Router();

require('dotenv').config();

const Game = require("../models/Game");

// Add game to database
router.post("/api/insertgame", (async (req, res) =>
{
    let gameToInsert = req.body.gameToInsert;
    async function getJSON(search)
    {
        let result = await fetch("https://api.igdb.com/v4/games",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: `fields id, name, aggregated_rating; search "${search}"; limit 10;`
            }
        );

        const json = await result.json();
        return json;
    }

    getJSON(gameToInsert).then(data =>
    {
        for (let i = 0; i < data.length; i++)
        {
            let newGame = new Game();
            newGame.IGDB_id = data[i].id;
            newGame.Name = data[i].name;
            newGame.GameRanking = data[i].aggregated_rating;

            newGame.save();
        }
    }).catch(err =>
    {
        return res.status(400).json({ message: err });
    });

    return res.status(200).json({ message: "Game created successfully.", });
})
);

// Search game in database
router.post("/api/searchgame", (async (req, res) =>
{
    let search = req.body.search;
    let pattern = `${search}`;

    let games = await Game.find({ Name: { $regex: pattern, $options: 'i' } });
    if (games === null)
    {
        return res.status(400).json({ games: [], message: "Game not found." });
    }
    else
    {
        return res.status(200).json({ games: games, message: "Games Found" });
    }
})
);

// Populate names and covers for homepage by genre
router.post("/api/populatehomepage", (async (req, res) =>
{
    let genre = req.body.genre;
    let size = {
        1:'micro',
        2:'thumb',
        3:'cover_small',
        4:'logo_med',
        5:'cover_big',
        6:'720p',
        7:'1080p'
    };;

    let cover_size = size[req.body.size];

    async function getGenre(genre)
    {
        let result = await fetch("https://api.igdb.com/v4/games",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization':process.env.IGDB_AUTHORIZATION,
                },
                body: `fields id, name; where genres = ${genre} & total_rating_count > 100; sort total_rating desc; limit 10;`
            }
        );

        const json = await result.json();
        return json;
    }

    async function getCover(ids)
    {
        let result = await fetch("https://api.igdb.com/v4/covers",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization':process.env.IGDB_AUTHORIZATION,
                },
                body: `fields id, game, url; where game = (${ids});`
            }
        );

        const json = await result.json();
        return json;
    }

    getGenre(genre).then(async games =>
    {
        let ids = [];
        games.forEach(function(obj) {ids.push(obj.id)});

        return getCover(ids).then(covers => 
        {
            let object = {};
            covers.forEach(function(obj) {object[obj.game] = obj.url});

            let result = [];
            games.forEach(function(obj) {result.push({id:obj.id, name: obj.name, url:object[obj.id]})});

            result.forEach(function(obj) {
                newURL = obj.url.replace(/thumb/g, cover_size);
                obj.url = newURL;
            })

            return res.status(200).json({result: result});
        }).catch(err => {
            return res.status(400).json({ message: err, });
        });
    }).catch(err =>
    {
        return res.status(400).json({ message: err, });
    });
})
);

// Gets the url for game cover
router.post("/api/getcover", (async (req, res) => 
{
    let id = req.body.id;
    let size = {
        1:'micro',
        2:'thumb',
        3:'cover_small',
        4:'logo_med',
        5:'cover_big',
        6:'720p',
        7:'1080p'
    };

    let cover_size = size[req.body.size];

    async function getJSON(gameid)
    {
        let result = await fetch("https://api.igdb.com/v4/covers",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization':process.env.IGDB_AUTHORIZATION,
                },
                body: `fields url; where game = ${gameid};`
            }
        );

        const json = await result.json();
        return json;
    }

    getJSON(id).then(data =>
    {
        let url = data[0].url;
        let newURL = url.replace(/thumb/g, cover_size);
        return res.status(200).json({ image: newURL, });
    }).catch(err =>
    {
        return res.status(400).json({ message: err, });
    });

})
)

module.exports = router;