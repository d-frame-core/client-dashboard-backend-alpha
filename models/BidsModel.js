const mongoose = require("mongoose")

const bidSchema = mongoose.Schema({
    clientId: String,
    bidAmount: Number
})

module.exports = mongoose.model("Bid", bidSchema)