const mongoose = require("mongoose");

const bidSchema = mongoose.Schema({
  clientId: String,
  campaignBudget: {
    perDay: Number,
    totalDays: Number,
  },
  bidAmount: Number,
});

module.exports = mongoose.model("Bid", bidSchema);
