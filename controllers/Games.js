var express = require("express");
var functions = require('./gameFunctions');

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
        return 'http://localhost:3000/' + route;
    }
}

// Add game to database
const insertGame = async (req, res) =>
{
    let gameToInsert = req.body.gameToInsert;
    let gameId = req.body.gameId;
    let search = '';

    if (gameId !== undefined)
    {
        search = `where id = ${gameId};`;
    }
    else
    {
        search = `where total_rating != null & cover.url != null; search "${gameToInsert}"; limit 10;`;
    }

    await functions.getGame(search).then(async data =>
    {
        data.forEach(async function (obj)
        {
            let game = obj;

            const newGame = new Game();

            newGame.IGDB_id = game.id;
            newGame.Name = game.name;
            newGame.CoverURL = game.cover.url;
            newGame.Summary = game.storyline;
            newGame.ReleaseDate = new Date(game.first_release_date * 1000);
            newGame.Genre = game.genres;

            newGame.GameRanking = functions.getGameRatingOutOf5(game.total_rating);
            newGame.Images = await functions.getGameImages(game.screenshots);
            newGame.Links = await functions.getGameLinks(game.websites);

            let platforms = await functions.getGamePlatforms(game.platforms);

            if (platforms instanceof Array)
            {
                let p_names = [];
                let p_logos = [];

                platforms.forEach(function (obj)
                {
                    p_names.push(obj.name);
                    p_logos.push(obj.platform_logo);
                });

                newGame.Platforms = p_names;
                newGame.PlatformLogos = await functions.getGamePlatformLogos(p_logos);
            }
            newGame.Videos = await functions.getGameVideos(game.videos);
            newGame.AgeRating = await functions.getAgeRating(game.age_ratings);
            newGame.SimilarGames = game.similar_games;

            await newGame.save();
        });

        return res.status(200).json({ id: 1, message: "Game Inserted Successfully" });
    }).catch(err =>
    {
        return res.status(400).json({ id: -1, message: 'Bad Entry' });
    });
};

// Search game in database
const searchGame = async (req, res) =>
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
};

// Populate names and covers for homepage by genre
const populateHomePage = async (req, res) =>
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
    };

    let body = '';

    let cover_size = size[req.body.size];

    if (limit === undefined)
    {
        limit = 15;
    }

    if (topGamesFlag !== undefined)
    {
        body = `fields id, name; where follows > 100 & total_rating_count > 50 & first_release_date > 1514782800; sort total_rating desc; limit ${limit};`;
    }
    else
    {
        body = `fields id, name; where genres = (${genre}) & total_rating_count > 25 & first_release_date > 1514782800; sort total_rating desc; limit ${limit};`;
    }

    await functions.getGenre(body).then(async data =>
    {
        let objects = [];

        data.forEach(async function (obj)
        {
            let game = await Game.findOne({ IGDB_id: obj.id });

            if (game === null)
            {
                let js = JSON.stringify({ gameId: obj.id });
                let response = await fetch(buildPath("Games/api/insertgame"),
                    {
                        method: 'POST',
                        body: js,
                        credentials: 'include',
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
            let newURL = functions.updateCoverURL(game.CoverURL, cover_size);
            objects.push({ id: game.IGDB_id, name: game.Name, url: newURL });
        }

        return res.status(200).json({ result: objects, });
    }).catch(err =>
    {
        return res.status(400).json({ message: err, });
    });
};

// Gets the url for game cover
const getCover = async (req, res) => 
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
        let newURL = functions.updateCoverURL(game.CoverURL, cover_size);
        return res.status(200).json({ image: newURL });
    }
};

// Retrieves game info
const getGameInfo = async (req, res) =>
{
    let gameIds = req.body.gameId;

    if (gameIds instanceof Array)
    {
        let gameInfo = [];

        for (let id of gameIds)
        {
            gameInfo.push(await functions.getGameFromDB(id));
        }

        if (gameInfo.some(g => g === null))
        {
            return res.status(400).json({ message: "Game(s) not found." });
        }

        return res.status(200).json(gameInfo);
    }
    else 
    {
        let gameInfo = await functions.getGameFromDB(gameIds);

        if (gameInfo === null)
        {
            return res.status(400).json({ message: "Game not found." });
        }

        return res.status(200).json({ gameInfo });
    }
};

module.exports =
{
    insertGame,
    populateHomePage,
    searchGame,
    getCover,
    getGameInfo
};