const mongoose = require("mongoose");

const GameSchema = mongoose.Schema({
    IGDB_id: {
        type: Number,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    GameRanking: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    CoverURL: {
        type: String,
        required: true,
    }
}, { collection: 'Games' });

const Game = module.exports = mongoose.model("Game", GameSchema);