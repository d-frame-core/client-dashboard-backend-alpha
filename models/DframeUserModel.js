const mongoose = require('mongoose');

// Define a string enum for KYC statuses

const dFrameUserSchema = new mongoose.Schema(
  {
    publicAddress: { type: String, required: true, unique: true },
    address: {
      data: { type: String, default: '' },
      submitted: { type: Boolean, default: false },
      addressProof: { type: Object },
    },
    referralCode: { type: String, default: '' },
    kyc1: {
      status: {
        type: String,
        default: "unverified",
      },
      details: {
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        userName: { type: String, default: '' },
        phoneNumber: { type: String, default: '' },
        email: { type: String, default: '' },
      },
    },
    kyc2: {
      status: {
        type: String,
        default:"unverified"
      },
      details: {
        gender: { type: String, default: '' },
        country: { type: String, default: '' },
        state: { type: String, default: '' },
        city: { type: String, default: '' },
        street: { type: String, default: '' },
        doorno: { type: String, default: '' },
        pincode: { type: String, default: '' },
        dob: { type: String, default: '' },
        annualIncome: { type: String, default: '' },
      },
    },
    kyc3: {
      status: {
        type: String,
        default:"unverified"
      },
      governmentProof1: { type: Object },
      governmentProof2: { type: Object },
      userPhoto: { type: Object },
    },
    permissions: {
      location: { type: Boolean, default: true },
      cookies: { type: Boolean, default: true },
      callDataSharing: { type: Boolean, default: true },
      emailSharing: { type: Boolean, default: true },
      notification: { type: Boolean, default: true },
      storageOption: { type: String, default: 'GCP' },
    },
    profileImage: { type: Object },
    userData: [
      {
        dataDate: String,
        urlData: [
          {
            urlLink: String, // Change this to a regular array
            timestamps: [String], // Change this to a regular array
            tags: [String], // Change this to a regular array
            timespent: [Number],
          },
        ],
      },
    ],
    rewards: {
      verificationRewards: {
        reward: { type: Number },
        timestamp: { type: [String] },
        rewardCategory: { type: [String] },
        status: { type: String, default: 'unpaid' },
      },
      // dailyRewards: {
      //   browserDataRewards: {
      //     reward: { type: Number },
      //     timestamp: { type: [String] },
      //     status: { type: String, default: 'unpaid' },
      //   },
      //   adRewards: {
      //     reward: { type: Number },
      //     adIds: { type: [String] },
      //     timestamp: { type: [String] },
      //     status: { type: String, default: 'unpaid' },
      //   },
      //   emailDataRewards: {
      //     reward: { type: Number },
      //     timestamp: { type: [String] },
      //     status: { type: String, default: 'unpaid' },
      //   },
      //   callDataRewards: {
      //     reward: { type: Number },
      //     timestamp: { type: [String] },
      //     status: { type: String, default: 'unpaid' },
      //   },
      //   referralRewards: {
      //     reward: { type: Number },
      //     timestamp: { type: [String] },
      //     referrals: { type: [String] ,default: 'unpaid' },
      //   },
      // },
    },
    userAds: [
      {
        date: { type: String },
        ads: [
          {
            adsId: { type: String },
            rewards: { type: Number },
            status: { type: String, default: "unseen" },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Create a mongoose model for DFrameUser
const DFrameUser = mongoose.model('DFrameUser', dFrameUserSchema);

module.exports =  DFrameUser;
