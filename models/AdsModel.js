const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    clientId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    sessionId: Number,
    campaignName: String,
    campaignType: String,
    adName: String,
    socialMediaPages: {},
    startDate: String,
    startTime: String,
    endDate: String,
    endTime: String,
    audience: {
        location: String,
        ageFrom: Number,
        ageTo: Number,
        gender: String
    },
    image: String,
    adContent: String,
    adImpressions: Number,
    tags: [],
    assignedUsers: Number,
    users: []
});

module.exports = new mongoose.model("Ad", adSchema)