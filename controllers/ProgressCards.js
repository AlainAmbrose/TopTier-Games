var express = require("express");
var router = express.Router();

require("dotenv").config();

const Progress = require("../models/ProgressCard");

const app_name = "poosd-large-project-group-8-1502fa002270";
function buildPath(route) {
  if (process.env.NODE_ENV === "production") {
    return "https://" + app_name + ".herokuapp.com/" + route;
  } else {
    return "http://localhost:5001/" + route;
  }
}

router.post("/api/addusergame", async (req, res) => {
  const newCard = new Progress();
  newCard.UserId = req.body.userId;
  newCard.GameId = req.body.gameId;
  newCard.HoursPlayed = 0.0;
  newCard.DateLastPlayed = new Date();
  newCard.Status = 0;

  await newCard.save();

  return res
    .status(200)
    .json({ id: 1, message: "User game added successfully." });
});

router.post("/api/getusergame", async (req, res) => {
  let userId = req.body.userId;

  let card = await Progress.find({ UserId: userId });

  if (card === null) {
    return res.status(400).json({ games: [], message: "No games found." });
  } else {
    return res.status(200).json({ games: card, message: "Games found." });
  }
});

router.post("/api/deleteusergame", async (req, res) => {
  let userId = req.body.userId;
  let gameId = req.body.gameId;

  let card = await Progress.findOne({ UserId: userId, GameId: gameId });

  if (card === null) {
    return res.status(400).json({ id: -1, message: "No games found." });
  } else {
    let result = await Progress.deleteOne({ UserId: userId, GameId: gameId });

    if (result.deletedCount == 1) {
      return res
        .status(200)
        .json({ id: 1, message: "User game deleted successfully." });
    } else {
      return res
        .status(400)
        .json({
          id: -1,
          message: "User game deleted unsuccessfully. Please try again.",
        });
    }
  }
});
module.exports = router;
