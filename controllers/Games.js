var express = require("express");
var router = express.Router();
var functions = require("./gameFunctions");

require("dotenv").config();

const Game = require("../models/Game");

const app_name = "poosd-large-project-group-8-1502fa002270";
function buildPath(route) {
  if (process.env.NODE_ENV === "production") {
    return "https://" + app_name + ".herokuapp.com/" + route;
  } else {
    return "http://localhost:5001/" + route;
  }
}

// Add game to database
router.post("/api/insertgame", async (req, res) => {
  let gameToInsert = req.body.gameToInsert;
  let gameId = req.body.gameId;
  let search = "";

  if (gameId !== undefined) {
    search = `where id = ${gameId} & total_rating != null & cover.url != null;`;
  } else {
    search = `where total_rating != null & cover.url != null; search "${gameToInsert}"; limit 10;`;
  }

  await functions
    .getGame(search)
    .then(async (data) => {
      let result = [];
      data.forEach(function (obj) {
        result.push({
          id: obj.id,
          name: obj.name,
          ranking: obj.total_rating,
          url: obj.cover.url,
        });
      });

      result.forEach(function (obj) {
        const newGame = new Game();
        newGame.IGDB_id = obj.id;
        newGame.Name = obj.name;
        newGame.GameRanking = obj.ranking;
        newGame.CoverURL = obj.url;

        newGame.save();
      });

      return res
        .status(200)
        .json({ id: 1, message: "Game Inserted Successfully" });
    })
    .catch((err) => {
      return res.status(400).json({ id: -1, message: "Bad Entry" });
    });
});

// Search game in database
router.post("/api/searchgame", async (req, res) => {
  let search = req.body.search;
  let pattern = `${search}`;

  let games = await Game.find({ Name: { $regex: pattern, $options: "i" } });
  if (games === null) {
    return res.status(400).json({ games: [], message: "Game not found." });
  } else {
    return res.status(200).json({ games: games, message: "Games Found" });
  }
});

// Populate names and covers for homepage by genre
router.post("/api/populatehomepage", async (req, res) => {
  console.log("entering populatehomepage");
  let genre = req.body.genre;
  let limit = req.body.limit;
  let topGamesFlag = req.body.topGamesFlag;
  let size = {
    1: "micro",
    2: "thumb",
    3: "cover_small",
    4: "logo_med",
    5: "cover_big",
    6: "720p",
    7: "1080p",
  };

  let body = "";

  let cover_size = size[req.body.size];

  if (limit === undefined) {
    limit = 15;
  }

  if (topGamesFlag !== undefined) {
    body = `fields id, name; where follows > 100 & total_rating_count > 50; sort total_rating desc; limit ${limit};`;
  } else {
    body = `fields id, name; where genres = (${genre}) & total_rating_count > 50; sort total_rating desc; limit ${limit};`;
  }

  await functions
    .getGenre(body)
    .then(async (data) => {
      let objects = [];

      data.forEach(async function (obj) {
        let game = await Game.findOne({ IGDB_id: obj.id });
        console.log("GAME IDS", obj.id);
        if (game === null) {
          let js = JSON.stringify({ gameId: obj.id });
          let response = await fetch(buildPath("/Games/api/insertgame"), {
            method: "POST",
            body: js,
            headers: { "Content-Type": "application/json" },
          });

          let result = JSON.parse(await response.text());
          console.log("RESPONSE", result);
          if (result.id < 0) {
            return result.message;
          }
        }
      });

      for (let i = 0; i < data.length; i++) {
        let game = await Game.findOne({ IGDB_id: data[i].id });
        let newURL = functions.updateCoverURL(game.CoverURL, cover_size);
        objects.push({ id: game.IGDB_id, name: game.Name, url: newURL });
      }

      return res.status(200).json({ result: objects });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ message: "Error in populateHompage endpoint" });
    });
});

// Gets the url for game cover
router.post("/api/getcover", async (req, res) => {
  let id = req.body.id;
  let size = {
    1: "micro",
    2: "thumb",
    3: "cover_small",
    4: "logo_med",
    5: "cover_big",
    6: "720p",
    7: "1080p",
  };

  let cover_size = size[req.body.size];

  let game = await Game.findOne({ IGDB_id: id });

  if (game === null) {
    return res.status(400).json({ image: "Error" });
  } else {
    functions.updateCoverURL(game.CoverURL, cover_size);
    return res.status(200).json({ image: newURL });
  }
});

router.post("/api/getgameinfo", async (req, res) => {
  let gameId = req.body.gameId;

  await functions
    .getGameInfo(gameId)
    .then(async (data) => {
      let game = data[0];
      let gameInfo = {};

      gameInfo.gameId = gameId;
      gameInfo.name = game.name;
      gameInfo.summary = game.storyline;
      gameInfo.releaseDate = game.first_release_date;
      gameInfo.genre = game.genres;

      gameInfo.rating = functions.getGameRatingOutOf5(game.total_rating);

      gameInfo.images = await functions.getGameImages(game.screenshots);
      gameInfo.links = await functions.getGameLinks(game.websites);
      gameInfo.platforms = await functions.getGamePlatforms(game.platforms);
      gameInfo.videos = await functions.getGameVideos(game.videos);
      gameInfo.ageRating = await functions.getAgeRating(game.age_ratings);

      gameInfo.similarGames = game.similar_games;

      return res.status(200).json({ gameInfo });
    })
    .catch((err) => {
      return res.status(400).json({ message: err });
    });

  const json = await result.json();
  return json;
});

module.exports = router;
