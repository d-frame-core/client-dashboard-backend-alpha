/** @format */

// /** @format */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DFrameUser = require('../models/DframeUserModel'); // Assuming your user model file is imported correctly

// // Function to update ads for the current and previous date
// const updateAdsForUser = async (publicAddress) => {
//   try {
//     const user = await DFrameUser.findOne({ publicAddress });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     const currentDate = new Date().toLocaleDateString('en-GB');
//     const previousDate = new Date();
//     previousDate.setDate(previousDate.getDate() - 1); // Get previous date
//     const formattedPreviousDate = previousDate.toLocaleDateString('en-GB');

//     // Find ads for the previous date with status UNSEEN
//     const previousDateAdsIndex = user.userAds.findIndex(
//       (ads) => ads.date === formattedPreviousDate
//     );

//     if (previousDateAdsIndex !== -1) {
//       const previousDateAds = user.userAds[previousDateAdsIndex].ads;
//       const unseenAds = previousDateAds.filter((ad) => ad.status === 'UNSEEN');

//       if (unseenAds.length > 0) {
//         const todayAds = {
//           date: currentDate,
//           ads: unseenAds,
//         };

//         // Push unseen ads for today's date
//         user.userAds.push(todayAds);

//         // Remove 'UNSEEN' ads from the previous date
//         user.userAds[previousDateAdsIndex].ads = previousDateAds.filter(
//           (ad) => ad.status !== 'UNSEEN'
//         );

//         await user.save();
//         console.log('Ads updated successfully');
//       } else {
//         console.log('No UNSEEN ads found for the previous date');
//       }
//     } else {
//       console.log('No ads found for the previous date');
//     }
//   } catch (error) {
//     console.error('Error updating ads:', error.message);
//   }
// };
// // Function to update surveys for the current and previous date
// const updateSurveyForUser = async (publicAddress) => {
//   try {
//     const user = await DFrameUser.findOne({ publicAddress });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     const currentDate = new Date().toLocaleDateString('en-GB');
//     const previousDate = new Date();
//     previousDate.setDate(previousDate.getDate() - 1); // Get previous date
//     const formattedPreviousDate = previousDate.toLocaleDateString('en-GB');

//     // Find surveys for the previous date with status UNSEEN
//     const previousDateSurveysIndex = user.userSurvey.findIndex(
//       (survey) => survey.date === formattedPreviousDate
//     );

//     if (previousDateSurveysIndex !== -1) {
//       const previousDateSurveys =
//         user.userSurvey[previousDateSurveysIndex].surveys;
//       const unseenSurveys = previousDateSurveys.filter(
//         (survey) => survey.status === 'UNSEEN'
//       );

//       if (unseenSurveys.length > 0) {
//         const todaySurveys = {
//           date: currentDate,
//           surveys: unseenSurveys,
//         };

//         // Push unseen surveys for today's date
//         user.userSurvey.push(todaySurveys);

//         // Remove 'UNSEEN' surveys from the previous date
//         user.userSurvey[previousDateSurveysIndex].surveys =
//           previousDateSurveys.filter((survey) => survey.status !== 'UNSEEN');

//         await user.save();
//         console.log('Surveys updated successfully');
//       } else {
//         console.log('No UNSEEN surveys found for the previous date');
//       }
//     } else {
//       console.log('No surveys found for the previous date');
//     }
//   } catch (error) {
//     console.error('Error updating surveys:', error.message);
//   }
// };

// // Route to update ads and surveys for all users
// router.patch('/update-date', async (req, res) => {
//   try {
//     const users = await DFrameUser.find({});

//     if (!users || users.length === 0) {
//       return res.status(404).json({ message: 'No users found' });
//     }

//     for (const user of users) {
//       await updateAdsForUser(user.publicAddress);
//       await updateSurveyForUser(user.publicAddress);
//     }

//     res
//       .status(200)
//       .json({ message: 'Ads and surveys updated successfully for all users' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Function to update ads and surveys for all users
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
module.exports.Cron = router;

// Schedule the job to run every 7 days (every Monday at 00:00)
// cron.schedule('0 0 * * 1', async () => {
//   await updateAdsAndSurveysForAllUsers();
// }, {
//   scheduled: true,
//   timezone: 'your_timezone', // Set your timezone, like 'America/New_York'
// });
