const mongoose = require("mongoose");

const ProgressSchema = mongoose.Schema({
  UserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
  },
  GameId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
  },
  HoursPlayed: {
      type: Number,
      required: true,
  },
  DateLastPlayed: {
      type: Date,
      required: true,
  },
  DateAdded: {
      type: Date,
      required: true,
  },
  Status: {
      type: Number,
      required: true,
  }
}, { collection: 'UserProgress' });

const Progress = module.exports = mongoose.model("ProgressCard", ProgressSchema);