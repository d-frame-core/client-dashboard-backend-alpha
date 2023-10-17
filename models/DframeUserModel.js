/** @format */

const mongoose = require('mongoose');

const KYCStatus = {
  Unsubmitted: 'unsubmitted',
  Unverified: 'unverified',
  Verified: 'verified',
  Stop: 'stop',
  Resubmit: 'resubmit',
  Resubmitted: 'resubmitted',
};

const dFrameUserSchema = new mongoose.Schema(
  {
    publicAddress: { type: String, required: true, unique: true },
    referralCode: { type: String, default: '' },
    kyc1: {
      status: {
        type: String,
        enum: Object.values(KYCStatus),
        default: KYCStatus.Unsubmitted,
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
        enum: Object.values(KYCStatus),
        default: KYCStatus.Unsubmitted,
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
        enum: Object.values(KYCStatus),
        default: KYCStatus.Unsubmitted,
      },
      addressProof: { type: String, default: '' },
      idProof: { type: String, default: '' },
      userPhoto: { type: String, default: '' },
    },
    permissions: {
      location: { type: Boolean, default: true },
      browserData: { type: Boolean, default: true },
      callDataSharing: { type: Boolean, default: true },
      emailSharing: { type: Boolean, default: true },
      notification: { type: Boolean, default: true },
      storageOption: { type: String, enum: ['GCP', 'IPFS'], default: 'GCP' },
    },
    profileImage: { type: String, default: '' },
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
    userAds: [
      {
        date: { type: String },
        ads: [
          {
            adsId: { type: String },
            rewards: { type: Number },
            status: { type: String, default: 'UNSEEN' },
          },
        ],
      },
    ],
    userSurvey: [
      {
      surveyId: { type: String },
      rewards: { type: Number },
      status: { type: String, default: 'UNSEEN' },
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

dFrameUserSchema.statics.build = (attrs) => {
  return new DFrameUser(attrs);
};

const DFrameUser = mongoose.model('DFrameUser', dFrameUserSchema);

module.exports = DFrameUser ;
