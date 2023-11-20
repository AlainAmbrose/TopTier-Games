const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');

require("dotenv").config();
const path = require("path");
const PORT = process.env.PORT || 3001;
const uri = process.env.MONGODB_URL;

const usersRouter = require('./routes/userRouter');
const gamesRouter = require('./routes/gameRouter');
const progressRouter = require('./routes/progressRouter');
const rankingRouter = require('./routes/rankingRouter');
const refreshRouter = require('./routes/refreshRouter');



mongoose.connect(uri);

const app = express();

app.set("port", process.env.PORT || 3001);

const allowedOrigins = ['http://localhost:3000', "https://poosd-large-project-group-8-1502fa002270.herokuapp.com/"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

app.use('/Users', usersRouter);
app.use('/Games', gamesRouter);
app.use('/Progress', progressRouter);
app.use('/Ranking', rankingRouter);
app.use('/Refresh', refreshRouter);
