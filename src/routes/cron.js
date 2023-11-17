/** @format */

// /** @format */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DFrameUser = require('../models/DframeUserModel'); // Assuming your user model file is imported correctly
const cron = require('node-cron');
const updateAdsAndSurveysForAllUsers = async () => {
  try {
    const users = await DFrameUser.find({});

    if (!users || users.length === 0) {
      throw new Error('No users found');
    }

    for (const user of users) {
      // Update ads for the user
      const currentDate = new Date().toLocaleDateString('en-GB');
      const previousDate = new Date();
      previousDate.setDate(previousDate.getDate() - 1);
      const formattedPreviousDate = previousDate.toLocaleDateString('en-GB');

      // Update ads logic
      const previousDateAdsIndex = user.userAds.findIndex(
        (ads) => ads.date === formattedPreviousDate
      );

      if (previousDateAdsIndex !== -1) {
        const previousDateAds = user.userAds[previousDateAdsIndex].ads;
        const unseenAds = previousDateAds.filter(
          (ad) => ad.status === 'UNSEEN'
        );

        if (unseenAds.length > 0) {
          const todayAds = {
            date: currentDate,
            ads: unseenAds,
          };

          user.userAds.push(todayAds);
          user.userAds[previousDateAdsIndex].ads = previousDateAds.filter(
            (ad) => ad.status !== 'UNSEEN'
          );
        }
      }

      // Update surveys logic
      const previousDateSurveysIndex = user.userSurvey.findIndex(
        (survey) => survey.date === formattedPreviousDate
      );

      if (previousDateSurveysIndex !== -1) {
        const previousDateSurveys =
          user.userSurvey[previousDateSurveysIndex].surveys;
        const unseenSurveys = previousDateSurveys.filter(
          (survey) => survey.status === 'UNSEEN'
        );

        if (unseenSurveys.length > 0) {
          const todaySurveys = {
            date: currentDate,
            surveys: unseenSurveys,
          };

          user.userSurvey.push(todaySurveys);
          user.userSurvey[previousDateSurveysIndex].surveys =
            previousDateSurveys.filter((survey) => survey.status !== 'UNSEEN');
        }
      }

      // Save changes to the user
      await user.save();
    }

    console.log('Ads and Surveys updated successfully for all users');
  } catch (error) {
    console.error('Error updating Ads and Surveys:', error.message);
  }
};

router.patch('/update-date', async (req, res) => {
  try {
    await updateAdsAndSurveysForAllUsers();
    res
      .status(200)
      .json({ message: 'Ads and Surveys updated successfully for all users' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
module.exports.CronJob = router;

cron.schedule(
  '0 1 * * *',
  async () => {
    await updateAdsAndSurveysForAllUsers();
  },
  {
    scheduled: true,
    timezone: 'Asia/Kolkata',
  }
);
