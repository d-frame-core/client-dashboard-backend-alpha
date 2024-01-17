/** @format */

const mongoose = require('mongoose');
const DframeUser = require('../models/DframeUserModel');
const express = require('express');
const AdsModel = require('../models/AdsModel');
const Survey = require('../models/SurveyModel');
const Ad = require('../models/AdsModel');
const RewardRequest = require('../models/reward.model');
const Transaction = require('../models/Transaction');
const { User } = require('../models/UsersModel');
const { Tag } = require('../models/Tags');
const UsersModel = require('../models/UsersModel');
const router = express.Router();

router.get('/admin/totalUsers', async (req, res) => {
  await DframeUser.find({}).countDocuments((err, count) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    res.status(200).json({
      count,
    });
  });
});

// Information route for surveys
router.get('/admin/surveyInfo', async (req, res) => {
  try {
    // Get total number of surveys
    const totalSurveys = await Survey.countDocuments();

    // Get counts of surveys based on each status
    const statusCounts = await Survey.aggregate([
      {
        $group: {
          _id: '$statusCampaign',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the result for better readability
    const statusInfo = {};
    statusCounts.forEach((status) => {
      statusInfo[status._id] = status.count;
    });

    // Send the response
    res.status(200).json({
      totalSurveys,
      statusInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});

// Information route for ads
router.get('/admin/adInfo', async (req, res) => {
  try {
    // Get total number of ads
    const totalAds = await Ad.countDocuments();

    // Get counts of ads based on each status
    const statusCounts = await Ad.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the result for better readability
    const statusInfo = {};
    statusCounts.forEach((status) => {
      statusInfo[status._id] = status.count;
    });

    // Send the response
    res.status(200).json({
      totalAds,
      statusInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});

router.get('/admin/rewardInfo', async (req, res) => {
  try {
    // Get total number of reward requests
    const totalRewardRequests = await RewardRequest.countDocuments();

    // Get counts of reward requests based on each status
    const statusCounts = await RewardRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the result for better readability
    const statusInfo = {};
    statusCounts.forEach((status) => {
      statusInfo[status._id] = status.count;
    });

    // Send the response
    res.status(200).json({
      totalRewardRequests,
      statusInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});

// Information route for transactions
router.get('/admin/transactionInfo', async (req, res) => {
  try {
    // Get total number of transactions
    const totalTransactions = await Transaction.countDocuments();

    // Get counts of transactions based on each status
    const statusCounts = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the result for better readability
    const statusInfo = {};
    statusCounts.forEach((status) => {
      statusInfo[status._id] = status.count;
    });

    // Send the response
    res.status(200).json({
      totalTransactions,
      statusInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});

// Information route for tags
router.get('/admin/tagInfo', async (req, res) => {
  try {
    // Get total number of tags
    const totalTags = await Tag.countDocuments();

    // Get counts of tags based on each status
    const statusCounts = await Tag.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the result for better readability
    const statusInfo = {};
    statusCounts.forEach((status) => {
      statusInfo[status._id] = status.count;
    });

    // Send the response
    res.status(200).json({
      totalTags,
      statusInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});

router.get('/admin/totalClient', async (req, res) => {
  await UsersModel.find({}).countDocuments((err, count) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    res.status(200).json({
      count,
    });
  });
});
// /admin/allinfo route
router.get('/admin/allinfo', async (req, res) => {
  try {
    // Get total count for DFrameUsers and Users
    const dframeUsersCount = await DframeUser.countDocuments();
    const usersCount = await User.countDocuments();

    // Get total counts and status-based counts for surveys
    const totalSurveys = await Survey.countDocuments();
    const surveyInfo = await Survey.aggregate([
      {
        $group: {
          _id: '$statusCampaign',
          total: { $sum: 1 },
        },
      },
    ]);

    // Get total counts and status-based counts for ads
    const totalAds = await Ad.countDocuments();
    const adInfo = await Ad.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 },
        },
      },
    ]);

    // Get total counts and status-based counts for reward requests
    const totalRewards = await RewardRequest.countDocuments();
    const rewardInfo = await RewardRequest.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 },
        },
      },
    ]);

    // Get total counts and status-based counts for transactions
    const totalTransactions = await Transaction.countDocuments();
    const transactionInfo = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 },
        },
      },
    ]);

    // Get total counts and status-based counts for tags
    const totalTags = await Tag.countDocuments();
    const tagInfo = await Tag.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 },
        },
      },
    ]);

    // Combine results
    const allInfo = {
      usersInfo: { total: dframeUsersCount },
      surveyInfo: { total: totalSurveys, status: surveyInfo },
      adInfo: { total: totalAds, status: adInfo },
      rewardInfo: { total: totalRewards, status: rewardInfo },
      transactionInfo: { total: totalTransactions, status: transactionInfo },
      tagInfo: { total: totalTags, status: tagInfo },
      clientInfo: { total: usersCount },
    };

    // Send the response
    res.status(200).json(allInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});
module.exports = router;
module.exports.UserInfo = router;
