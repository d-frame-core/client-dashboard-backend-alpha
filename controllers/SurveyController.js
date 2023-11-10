/** @format */

const mongoose = require('mongoose');
const path = require('path'); // Import the path module

const Survey = require(path.join(__dirname, '..', 'models', 'SurveyModel'));
const DframeUser = require(path.join(
  __dirname,
  '..',
  'models',
  'DframeUserModel'
));

// Create a new surveyddd
// exports.createSurvey = async (req, res) => {
//   try {
//     const survey = await Survey.create(req.body);
//     console.log(survey);
//     let DframeUsers = await DframeUser.find();
//     let matcheDframeUserIds = [];
//     DframeUsers.forEach((duser) => {
//       duser.userSurvey.push({ surveyId: survey._id, rewards: 1 });
//       duser.save();
//       matcheDframeUserIds.push(duser._id);
//       console.log('user added', duser._id);
//     });
//     survey.userAssigned = matcheDframeUserIds;
//     survey.save();
//     res.status(201).json({
//       message: 'Post created successfully',
//       id: matcheDframeUserIds,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
exports.createSurvey = async (req, res) => {
  console.log('Entered Create Survey');
  try {
    const survey = await Survey.create(req.body);
    console.log(survey);
    let DframeUsers = await DframeUser.find();
    let matcheDframeUserIds = [];
    const currentDate = new Date().toLocaleDateString('en-GB');

    DframeUsers.forEach(async (duser) => {
      const existingSurveyEntry = duser.userSurvey.find(
        (entry) => entry.date === currentDate
      );

      if (existingSurveyEntry) {
        // Survey entry for the current date exists, push survey details to that entry
        existingSurveyEntry.surveys.push({
          surveyId: survey._id,
          rewards: 1,
          status: 'UNSEEN',
        });
      } else {
        // Create a new entry with the current date
        duser.userSurvey.push({
          date: currentDate,
          surveys: [{ surveyId: survey._id, rewards: 1, status: 'UNSEEN' }],
        });
      }

      await duser.save();
      matcheDframeUserIds.push(duser._id);
      console.log('user added', duser._id);
    });

    survey.userAssigned = matcheDframeUserIds;
    await survey.save();

    res.status(201).json({
      message: 'Post created successfully',
      id: matcheDframeUserIds,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all surveys created by a particular client
/*exports.getSurveysByclient = async (req, res) => {
  const clientId = req.headers.clientid;
  try {
    const surveys = await Survey.find({ clientId: clientId });
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};*/
exports.getSurveysByclient = async (req, res) => {
  const clientId = req.headers.clientid;
  const currentDate = new Date();

  try {
    const surveys = await Survey.find({
      clientId: clientId,
      endDate: { $gte: currentDate },
    });

    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all surveys
exports.getSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSurveyAnalysis = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const analysis = survey.totalQues.map((question) => {
      const options = question.options;
      const optionCounts = options.map((option) => {
        const optionGroup = question.optionGroups.find(
          (group) => group.option === option
        );
        const count = optionGroup ? optionGroup.userAnswers.length : 0;
        const totalAnswers = question.optionGroups.reduce((total, group) => {
          return total + group.userAnswers.length;
        }, 0);
        const percentage =
          totalAnswers > 0 ? ((count / totalAnswers) * 100).toFixed(2) : 0;
        return {
          option: option,
          count: count,
          percentage: percentage,
        };
      });
      optionCounts.sort((a, b) => b.count - a.count);
      const maxCount = optionCounts[0].count;
      const mostChosenAnswers = optionCounts.filter(
        (optionCount) => optionCount.count === maxCount
      );
      return {
        question: question.title,
        mostChosenAnswers: mostChosenAnswers.map(
          (optionCount) => optionCount.option
        ),
        userCount: maxCount,
        allAnswers: optionCounts,
      };
    });
    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// Get expired surveys
exports.getExpiredSurveys = async (req, res) => {
  try {
    const expiredSurveys = await Survey.find({
      endDate: { $lt: new Date() },
    });
    res.json(expiredSurveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//Get expierdsurveys of a particular client
exports.getExpiredSurveysByclientid = async (req, res) => {
  const clientId = req.headers.clientid;
  try {
    const expiredSurveysc = await Survey.find({
      clientId: clientId,
      endDate: { $lt: new Date() },
    });
    if (expiredSurveysc.length === 0) {
      return res
        .status(404)
        .json({ message: 'No expired surveys found for this client.' });
    }
    res.json(expiredSurveysc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExpiredSurveyById = async (req, res) => {
  const surveyId = req.params.id;
  try {
    const expiredSurvey = await Survey.findOne({
      _id: surveyId,
      endDate: { $lt: new Date() },
    });
    if (!expiredSurvey) {
      return res.status(404).json({ message: 'Expired survey not found' });
    }
    res.json(expiredSurvey);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a survey
exports.update = (req, res) => {
  Survey.findByIdAndUpdate(req.params.surveyId, req.body, { new: true })
    .then((survey) => {
      if (!survey) {
        return res.status(404).send({
          message: 'Survey not found with id ' + req.params.surveyId,
        });
      }
      res.send(survey);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: 'Survey not found with id ' + req.params.surveyId,
        });
      }
      return res.status(500).send({
        message: 'Error updating survey with id ' + req.params.surveyId,
      });
    });
};

//verify status
exports.verifyStatus = async (req, res) => {
  try {
    // Find the ad by its ID
    const surveyId = req.params.id; // Assuming you pass the ad ID as a route parameter
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Update the status to "verified"
    survey.statusCampaign = 'verified';

    // Save the updated ad
    await survey.save();

    return res.status(200).json({ message: 'Status updated to verified' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//pause status
exports.stopStatus = async (req, res) => {
  try {
    // Find the ad by its ID
    const surveyId = req.params.id; // Assuming you pass the ad ID as a route parameter
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Update the status to "verified"
    survey.statusCampaign = 'stop';

    // Save the updated ad
    await survey.save();

    return res.status(200).json({ message: 'Status updated to verified' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//expired status
exports.expireStatus = async (req, res) => {
  try {
    // Find the ad by its ID
    const surveyId = req.params.id; // Assuming you pass the ad ID as a route parameter
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Update the status to "verified"
    survey.statusCampaign = 'expired';

    // Save the updated ad
    await survey.save();

    return res.status(200).json({ message: 'Status updated to verified' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a survey with the specified surveyId in the request
exports.delete = (req, res) => {
  Survey.findByIdAndRemove(req.params.surveyId)
    .then((survey) => {
      if (!survey) {
        return res.status(404).send({
          message: 'Survey not found with id ' + req.params.surveyId,
        });
      }
      res.send({ message: 'Survey deleted successfully!' });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: 'Survey not found with id ' + req.params.surveyId,
        });
      }
      return res.status(500).send({
        message: 'Could not delete survey with id ' + req.params.surveyId,
      });
    });
};

//delete particulr survey of client
exports.deleteSurvey = async (req, res) => {
  const clientId = req.headers.clientid;

  try {
    const survey = await Survey.findOneAndDelete({
      clientId: clientId,
    });
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.json({ message: 'Survey deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete all survey
exports.deleteAllSurveys = async (req, res) => {
  try {
    await Survey.deleteMany();
    res.json({ message: 'All surveys deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete expired survey of a particular client
exports.deleteExpiredSurveys = async (req, res) => {
  const clientId = req.headers.clientid;
  try {
    const expiredSurveys = await Survey.find({
      clientId: clientId,
      endDate: { $lt: new Date() },
    });
    if (expiredSurveys.length === 0) {
      return res.status(404).json({ message: 'No expired surveys found' });
    }
    await Survey.deleteMany({
      clientId: clientId,
      endDate: { $lt: new Date() },
    });
    res.json({ message: 'Expired surveys deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  function to get survey by ID
exports.findOne = (req, res) => {
  const surveyId = req.params.surveyId;
  const clientId = req.body.clientId;

  Survey.findById(surveyId)
    .then((survey) => {
      if (!survey) {
        return res.status(404).send({
          message: 'Survey not found with id ' + surveyId,
        });
      }

      // Check if the client has created the survey
      /*if (survey.clientId !== clientId) {
        return res.status(403).send({
          message: "You are not authorized to access this survey."
        });
      }*/

      res.send(survey);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: 'Survey not found with id ' + surveyId,
        });
      }
      return res.status(500).send({
        message: 'Error retrieving survey with id ' + surveyId,
      });
    });
};

exports.updateStatusSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Update survey status based on request body
    survey.statusCampaign = req.body.isActive ? 'active' : 'inactive';
    await survey.save();

    return res
      .status(200)
      .json({ message: 'Survey status updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
