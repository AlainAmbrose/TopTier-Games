const mongoose = require("mongoose");

const GameSchema = mongoose.Schema({
    IGDB_id: {
        type: Number,
    },
    Name: {
        type: String,
    },
    GameRanking: {
        type: mongoose.Schema.Types.Decimal128,
    }
}, { collection: 'Games' });

GameSchema.methods.getId = function ()
{
    return this._id;
};

GameSchema.methods.getIdAPI = function ()
{
    return this.IGDB_id;
};

GameSchema.methods.getName = function ()
{
    return this.Name;
};

GameSchema.methods.getRanking = function ()
{
    return this.GameRanking;
};


const Game = module.exports = mongoose.model("Game", GameSchema);