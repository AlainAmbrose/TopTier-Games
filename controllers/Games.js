var functions = require("./gameFunctions");
require("dotenv").config();

const Game = require("../models/Game");

function buildPath(route) {
  if (process.env.NODE_ENV === "production") {
    return "https://www.toptier.games/" + route;
  } else {
    return "http://localhost:3001/" + route;
  }
}

// Add game to database
const insertGame = async (req, res) => {
  let gameToInsert = req.body.gameToInsert;
  let gameId = req.body.gameId;
  let search = "";

  if (gameId !== undefined) {
    search = `where id = ${gameId};`;
  } else {
    search = `where total_rating != null & cover.url != null; search "${gameToInsert}"; limit 10;`;
  }

  await functions
    .getGame(search)
    .then(async (data) => {
      let errorFlag = false;
      for (let obj of data) {
        let game = obj;

        const newGame = new Game();

        if (game.id) newGame.IGDB_id = game.id;
        else {
          errorFlag = true;
          break;
        }
        if (game.name) newGame.Name = game.name;
        else {
          errorFlag = true;
          break;
        }
        if (game.cover && game.cover.url) newGame.CoverURL = game.cover.url;
        else {
          errorFlag = true;
          break;
        }
        if (game.storyline) newGame.Summary = game.storyline;
        if (game.first_release_date)
          newGame.ReleaseDate = new Date(game.first_release_date * 1000);
        if (game.genres) newGame.Genre = game.genres;

        if (game.total_rating)
          newGame.GameRanking = functions.getGameRatingOutOf5(
            game.total_rating
          );
        else {
          errorFlag = true;
          break;
        }

        if (game.total_rating_count)
          newGame.ReviewCount = game.total_rating_count;

        if (game.screenshots)
          newGame.Images = await functions.getGameImages(game.screenshots);
        if (game.websites)
          newGame.Links = await functions.getGameLinks(game.websites);

        let platforms = await functions.getGamePlatforms(game.platforms);

        if (platforms instanceof Array) {
          let p_names = [];
          let p_logos = [];

          platforms.forEach(function (obj) {
            p_names.push(obj.name);
            p_logos.push(obj.platform_logo);
          });

          if (p_names.length === 0) newGame.Platforms = p_names;
          if (p_logos.length === 0)
            newGame.PlatformLogos = await functions.getGamePlatformLogos(
              p_logos
            );
        }

        if (game.videos)
          newGame.Videos = await functions.getGameVideos(game.videos);

        if (game.age_ratings)
          newGame.AgeRating = await functions.getAgeRating(game.age_ratings);

        if (game.similar_games) newGame.SimilarGames = game.similar_games;

        await newGame.save();
      }

      if (errorFlag)
        return res.status(400).json({ id: -1, message: "Bad Entry" });

      return res
        .status(200)
        .json({ id: 1, message: "Game Inserted Successfully" });
    })
    .catch((err) => {
      return res.status(400).json({ id: -1, message: "Bad Entry" });
    });
};

// Search game in database
const searchGame = async (req, res) => {
  let search = req.body.search;
  let genreFlag = req.body.genreFlag;
  let pattern = `${search}`;
  let games = [];

  const converter = {
    _id: "_id",
    Summary: "storyline",
    AgeRating: "ageratings", 
    CoverURL: "url",
    GameRanking: "gameranking",
    Genre: "genres",
    IGDB_id: "id",
    Images: "images",
    Links: "links",
    Name: "name",
    PlatformLogos: "platformlogos",
    Platforms: "platforms",
    ReleaseDate: "releasedate",
    ReviewCount: "reviewcount",
    SimilarGames: "similargames",
  };

  const genres = {
    "Point-and-click": 2,
    "Fighting": 4,
    "Shooter": 5,
    "Music": 7,
    "Platform": 8,
    "Puzzle": 9,
    "Racing": 10,
    "Real Time Strategy (RTS)": 11,
    "Role-playing (RPG)": 12,
    "Simulator": 13,
    "Sport":14,
    "Strategy":15,
    "Turn-based strategy (TBS)":16,
    "Tactical":24,
    "Hack and slash/Beat 'em up":25,
    "Quiz/Trivia":26,
    "Pinball":30,
    "Adventure":31,
    "Indie":32,
    "Arcade":33,
    "Visual Novel":34,
    "Card & Board Game":35,
    "MOBA":36
  }

  if (genreFlag === undefined) genreFlag = false;
  
  if (genreFlag)
  {
    games = await Game.find({Genre: genres[search]})
  }
  else
  {
    games = await Game.find({ Name: { $regex: pattern, $options: "xi" } });
  }


  if (games === null) {
    return res.status(400).json({ games: [], message: "Game not found." });
  } else {
    console.log("before",games[0]);

    newGames = games.map((game) => {
      // Convert the Mongoose document to a JavaScript object
      let gameObj = game.toObject();
      let newGame = {};
      for (const key of Object.keys(gameObj)) {
        if (key in converter && "CoverURL" !== key) {
          newGame[converter[key]] = gameObj[key];
        } else if ( key in converter && "CoverURL" === key) {
          newGame[converter[key]] = functions.updateCoverURL(gameObj[key], "1080p");
        }
      }
      return newGame;
    });
    console.log("After", newGames[0]);
    return res.status(200).json({ games: newGames, message: "Games Found" });
  }
};

// Populate names and covers for homepage by genre
const populateHomePage = async (req, res) => {
  let cookies = req.cookies;
  if (!cookies?.jwt_access)
    return res.sendStatus(401).json({ message: "No access token" });

  let jwt_access = cookies.jwt_access;
  let jwt_refresh = cookies.jwt_refresh;

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
    body = `fields id, name; where follows > 100 & total_rating_count > 50 & first_release_date > 1514782800; sort total_rating desc; limit ${limit};`;
  } else {
    body = `fields id, name; where genres = (${genre}) & total_rating_count > 25 & first_release_date > 1514782800; sort total_rating desc; limit ${limit};`;
  }

  await functions
    .getGenre(body, limit)
    .then(async (data) => {
      let objects = [];

      data.forEach(async function (obj) {
        let game = await Game.findOne({ IGDB_id: obj.id });

        if (game === null) {
          let js = JSON.stringify({ gameId: obj.id });
          let response = await fetch(buildPath("Games/api/insertgame"), {
            method: "POST",
            body: js,
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Cookie: `jwt_access=${jwt_access}; jwt_refresh=${jwt_refresh}`,
            },
          });

          let result = JSON.parse(await response.text());
          if (result.status === 401) {
            return result.status;
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
      return res.status(400).json({ message: err });
    });
};

// Gets the url for game cover
const getCover = async (req, res) => {
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
    let newURL = functions.updateCoverURL(game.CoverURL, cover_size);
    return res.status(200).json({ image: newURL });
  }
};

// Retrieves game info
const getGameInfo = async (req, res) => {
  const converter = {
    _id: "_id",
    id: "IGDB_id",
    name: "Name",
    coverURL: "CoverURL",
    storyline: "Summary",
    releasedate: "ReleaseDate",
    genres: "Genre",
    gameranking: "GameRanking",
    images: "Images",
    links: "Links",
    platforms: "Platforms",
    platformlogos: "PlatformLogos",
    videos: "Videos",
    ageratings: "AgeRating",
    similargames: "SimilarGames",
    reviewcount: "ReviewCount",
  };
  
  let gameIds = req.body.gameId;

  let options = req.body.options;

  let cookies = req.cookies;
  if (!cookies?.jwt_access && !cookies?.jwt_refresh) {
    return res.sendStatus(403);
  }

  let opts = {};

  if (options !== undefined) {
    for (const key of Object.keys(options)) {
      if (options[key] === true) {
        opts[converter[key]] = 1;
      }
    }
  }

  if (gameIds instanceof Array) {
    let gameInfo = [];

    for (let id of gameIds) {
      let result = await functions.getGameFromDB(id, opts, cookies);
      gameInfo.push(result);

      setTimeout(() => {}, 250);
    }

    gameInfo = gameInfo.filter((g) => g !== null);

    return res.status(200).json(gameInfo);
  } else {
    let gameInfo = await functions.getGameFromDB(gameIds, opts, cookies);

    if (gameInfo === null) {
      return res.status(400).json({ message: "Game not found." });
    }

    return res.status(200).json({ gameInfo });
  }
};

module.exports = {
  insertGame,
  populateHomePage,
  searchGame,
  getCover,
  getGameInfo,
};
