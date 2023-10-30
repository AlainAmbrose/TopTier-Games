var express = require("express");
var router = express.Router();

require('dotenv').config();

const Game = require("../models/Game");

const app_name = "poosd-large-project-group-8-1502fa002270";
function buildPath(route)
{
    if (process.env.NODE_ENV === 'production')
    {
        return 'https://' + app_name + '.herokuapp.com/' + route;
    } else
    {
        return 'http://localhost:5000/' + route;
    }
}

// Add game to database
router.post("/api/insertgame", (async (req, res) =>
{
    let gameToInsert = req.body.gameToInsert;
    let gameId = req.body.gameId;
    let search = '';

    if (gameId !== undefined)
    {
        search = `where id = ${gameId} & total_rating != null & cover.url != null;`;
    }
    else
    {
        search = `where total_rating != null & cover.url != null; search "${gameToInsert}"; limit 10;`;
    }

    async function getGame(search)
    {
        let txt = `fields id, name, total_rating, cover.url; ${search}`;
        let result = await fetch("https://api.igdb.com/v4/games",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: txt,
            }
        );

        const json = await result.json();
        return json;
    }

    getGame(search).then(async data =>
    {
        let result = [];
        data.forEach(function (obj)
        {
            result.push({ id: obj.id, name: obj.name, ranking: obj.total_rating, url: obj.cover.url });
        });

        result.forEach(function (obj)
        {
            const newGame = new Game();
            newGame.IGDB_id = obj.id;
            newGame.Name = obj.name;
            newGame.GameRanking = obj.ranking;
            newGame.CoverURL = obj.url;

            newGame.save();
        });

        return res.status(200).json({ id: 1, message: "Game Inserted Successfully" });
    }).catch(err =>
    {
        return res.status(400).json({ id: -1, message: 'Bad Entry' });
    });
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
    let limit = req.body.limit;
    let topGamesFlag = req.body.topGamesFlag;
    let size = {
        1: 'micro',
        2: 'thumb',
        3: 'cover_small',
        4: 'logo_med',
        5: 'cover_big',
        6: '720p',
        7: '1080p'
    };;

    let body = '';

    let cover_size = size[req.body.size];

    if (topGamesFlag !== undefined)
    {
        body = `fields id, name; where follows > 100 & total_rating_count > 50; sort total_rating desc; limit ${limit};`;
    }
    else
    {
        body = `fields id, name; where genres = (${genre}) & total_rating_count > 50; sort total_rating desc; limit ${limit};`;
    }


    async function getGenre()
    {
        let result = await fetch("https://api.igdb.com/v4/games",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: body
            }
        );

        const json = await result.json();
        return json;
    }

    getGenre().then(async data =>
    {
        let objects = [];
        data.forEach(async function (obj)
        {
            let game = await Game.findOne({ IGDB_id: obj.id });

            if (game === null)
            {
                let js = JSON.stringify({ gameId: obj.id });
                let response = await fetch("https://poosd-large-project-group-8-1502fa002270.herokuapp.com/Games/api/insertgame",
                    {
                        method: 'POST',
                        body: js,
                        headers: { "Content-Type": "application/json" },
                    });

                let result = JSON.parse(await response.text());
                if (result.id < 0)
                {
                    return result.message;
                }
            }
        });


        for (let i = 0; i < data.length; i++)
        {
            let game = await Game.findOne({ IGDB_id: data[i].id });
            let url = game.CoverURL;
            let newURL = url.replace(/thumb/g, cover_size);
            objects.push({ id: game.IGDB_id, name: game.Name, url: newURL });
        }

        return res.status(200).json({ result: objects, });
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
        1: 'micro',
        2: 'thumb',
        3: 'cover_small',
        4: 'logo_med',
        5: 'cover_big',
        6: '720p',
        7: '1080p'
    };

    let cover_size = size[req.body.size];

    let game = await Game.findOne({ IGDB_id: id });

    if (game === null)
    {
        return res.status(400).json({ image: 'Error' });
    }
    else
    {
        let url = game.CoverURL;
        let newURL = url.replace(/thumb/g, cover_size);
        return res.status(200).json({ image: newURL });
    }
})
);

router.post("/api/getgameinfo", async (req, res) =>
{
    let gameId = req.body.gameId;

    async function getGameInfo()
    {
        let result = await fetch("https://api.igdb.com/v4/games",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': process.env.IGDB_CLIENT_ID,
                    'Authorization': process.env.IGDB_AUTHORIZATION,
                },
                body: `fields *; where id = ${gameId};`
            }
        );

        const json = await result.json();
        return json;
    }

    getGameInfo().then(async data =>
    {
        return res.status(200).json({ result: data[0], });
    }).catch(err =>
    {
        return res.status(400).json({ message: err, });
    });

});

module.exports = router;