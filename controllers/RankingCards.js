<<<<<<< HEAD
require('dotenv').config();
const Ranking = require("../models/RankingCard");

=======
var express = require("express");

require('dotenv').config();

const Ranking = require("../models/RankingCard");

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

>>>>>>> BACKEND-008/Password-Reset
const setRanking = async (req, res) =>
{
    let userId = req.body.userId;
    let gameId = req.body.gameId;
    let ranking = req.body.ranking;

    let rcard = await Ranking.findOne({ UserId: userId, GameId: gameId });

    if (rcard === undefined) 
    {
        return res.status(400).json({ id: -1, message: "No games found." });
    }
    else
    {
        rcard.Ranking = ranking;
        await rcard.save();

        return res.status(200).json({ id: 1, message: "Game rating successful" });
    }
};

const setReview = async (req, res) =>
{
    let userId = req.body.userId;
    let gameId = req.body.gameId;
    let review = req.body.review;

    let rcard = await Ranking.findOne({ UserId: userId, GameId: gameId });

    if (rcard === undefined) 
    {
        return res.status(400).json({ id: -1, message: "No games found." });
    }
    else
    {
        rcard.Review = review;
        rcard.ReviewDate = new Date();
        await rcard.save();

        return res.status(200).json({ id: 1, message: "Game review successful" });
    }
};

module.exports =
{
    setRanking,
    setReview
};