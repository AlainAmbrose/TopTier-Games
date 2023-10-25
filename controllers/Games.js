var express = require("express");
var router = express.Router();
require('dotenv').config();

const Game = require("../models/Game");

// Add game to database
router.post("/api/insertgame", (async (req, res) =>
{
    var gameToInsert = req.body.gameToInsert;
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
        console.log(err);
    });

    return res.status(200).json({ message: "Game created successfully.", });
})
);

// Search game in database
router.post("/api/searchgame", (async (req, res) =>
{
    var search = req.body.search;
    var pattern = `${search}`;

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

module.exports = router;