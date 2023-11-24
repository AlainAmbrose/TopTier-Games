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
    ReviewCount: {
        type: Number,
    },
    CoverURL: {
        type: String,
        required: true,
    },
    Summary: {
        type: String,
    },
    ReleaseDate: {
        type: Date,
    },
    Genre: {
        type: [Number],
    },
    Images: {
        type: [Object],
    },
    Links: {
        type: [Object]
    },
    Platforms: {
        type: [String],
    },
    PlatformLogos: {
        type: [Object],
    },
    Videos: {
        type: [Object],
    },
    AgeRating: {
        type: Object,
    },
    SimilarGames: {
        type: [Number]
    },
}, { collection: 'Games' });

const Game = module.exports = mongoose.model("Game", GameSchema);