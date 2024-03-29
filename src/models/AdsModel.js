/** @format */

const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
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
      gender: String,
    },
    image: String,
    adType: String,
    adContent: String,
    adUrl: String,
    adImpressions: Number,
    staus: String,
    tags: [],
    assignedUsers: Number,
    users: [],
    perDay: Number,
    totalDays: Number,
    bidAmount: Number,
    status: {
      type: String,
      default: 'UNVERIFIED',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model('Ad', adSchema);
