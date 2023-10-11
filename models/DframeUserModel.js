const mongoose = require('mongoose');

const dFrameUserSchema = new mongoose.Schema(
  {
    publicAddress: { type: String, required: true, unique: true },
    address: {
      data: { type: String, default: '' },
      submitted: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      addressProof: { type: Object },
    },
    referralCode: { type: String, default: '' },
    kyc1: {
      status: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      details: {
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        userName: { type: String, default: '' },
        phoneNumber: { type: String, default: '' },
        email: { type: String, default: '' },
      },
    },
    kyc2: {
      status: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
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
        permanentAddress: { type: String, default: '' },
      },
    },
    kyc3: {
      status: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      governmentProof1: { type: Object }, // New governmentProof1 field
      governmentProof2: { type: Object }, // New governmentProof2 field
      userPhoto: { type: Object }, // New userPhoto field
    },
    permissions: {
      location: { type: Boolean, default: true },
      cookies: { type: Boolean, default: true },
      callDataSharing: { type: Boolean, default: true },
      emailSharing: { type: Boolean, default: true },
      notification: { type: Boolean, default: true },
      storageOption: { type: String, enum: ['GCP', 'IPFS'], default: 'GCP' },
    },
    profileImage: { type: Object },
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

const DFrameUser = mongoose.model(
  'DFrameUser',
  dFrameUserSchema
);

module.exports = DFrameUser;
