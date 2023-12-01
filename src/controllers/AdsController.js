/** @format */

// AD history
// Analytics
const path = require('path');
const Ad = require(path.join(__dirname, '..', 'models', 'AdsModel'));
const multer = require('multer');
const User = require(path.join(__dirname, '..', 'models', 'UsersModel'));
const DframeUser = require(path.join(
  __dirname,
  '..',
  'models',
  'DframeUserModel'
));

let fileName;
require('dotenv').config();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    console.log(file);
    fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const getAd = async (req, res) => {
  try {
    const foundAd = await Ad.find({ adId: req.params.id });
    if (foundAd.length) {
      res.status(200).json(foundAd);
    } else {
      res.status(200).json({ message: 'No ad found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllAd = async (req, res) => {
  try {
    const foundAd = await Ad.find();
    res.status(200).json(foundAd);
  } catch (err) {
    res.status(500).json(err);
  }
};

const postAd = async (req, res) => {
  const newAd = new Ad({
    clientId: req.body.clientId,
    sessionId: req.body.sessionId,
    campaignName: req.body.campaignName,
    campaignType: req.body.campaignType,
    adName: req.body.adName,
    socialMediaPages: req.body.socialMediaPages,
    startDate: req.body.startDate,
    startTime: req.body.startTime,
    endDate: req.body.endDate,
    endTime: req.body.endTime,
    audience: {
      location: req.body.location,
      ageFrom: req.body.ageFrom,
      ageTo: req.body.ageTo,
      gender: req.body.gender,
    },
    image: req.body.image,
    adContent: req.body.adContent,
    tags: req.body.tags,
    perDay: req.body.perDay,
    totalDays: req.body.totalDays,
    bidAmount: req.body.bidAmount,
  });
  try {
    const savedAd = await newAd.save();
    let totalUser = newAd.perDay / newAd.bidAmount;
    let DframeUsers = await DframeUser.find();
    let matcheDframeUserIds = [];
    let i = 0;
    // while(totalUser>0){
    // const filteredUsers = DframeUsers.filter(duser => {
    //     return duser.userAds.some(adsObj => adsObj.ads.length === 0);
    //   })
    DframeUsers.forEach((duser) => {
      const userAdIndex = duser.userAds.findIndex(
        (entry) => entry.date === '2023-10-11'
      );
      if (userAdIndex !== -1) {
        // User has an entry for today's date, push the new
        duser.userAds[userAdIndex].ads.push({
          adsId: savedAd._id,
          rewards: newAd.bidAmount,
        });
      } else {
        // User doesn't have an entry for today's date, create a new entry
        duser.userAds.push({
          date: '2023-10-11',
          ads: [{ adsId: savedAd._id, rewards: newAd.bidAmount }],
        });
      }
      // Save the updated user data
      duser.save();
      matcheDframeUserIds.push(duser._id);
      totalUser--;
    });
    i++;
    // }
    res
      .status(201)
      .json({ message: 'Post created successfully', id: matcheDframeUserIds });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Some error occured' });
  }
};

// const updateAd = async (req, res) => {
//   try {
//     const result = await Ad.updateOne(
//       { adId: req.params.id },
//       { $set: req.body }
//     );

//     if (result.nModified > 0) {
//       console.log('Updated successfully', req.body);
//       res.status(200).json({ message: 'Updated Successfully' });
//     } else {
//       console.log('No changes were made to the ad');
//       res.status(200).json({ message: 'No changes made to the ad' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: 'Error Occured', error: err });
//   }
// };
const updateAd = async (req, res) => {
  try {
    // Fetch existing ad
    const ad = await Ad.findById(req.params.id);

    // Update adName and adContent
    if (req.body.adName) {
      ad.adName = req.body.adName;
    }
    if (req.body.adContent) {
      ad.adContent = req.body.adContent;
    }

    // Save updated ad
    const updatedAd = await ad.save();

    res.json(updatedAd);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating ad');
  }
};

const getAllClientDetails = async (req, res) => {
  const clientId = req.params.id;
  try {
    const clientDetails = await Ad.find({ clientId: clientId });
    // console.log('client details', clientDetails);
    res.status(200).json(clientDetails);
  } catch (err) {
    res.status(500).json({ message: 'Error Occured', error: err });
  }
};

const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (ad) {
      res.status(200).json({ message: 'Deleted Successfully' });
    } else {
      res.status(404).json({ message: 'Ad not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error Occurred', error: err });
  }
};

const adminUpdateAd = (req, res) => {
  try {
    Ad.updateOne(
      { adId: req.params.id },
      { $set: { status: req.body.status } },
      (err) => {
        if (!err) {
          res.status(200).json({ message: 'Updated Successfully' });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Error Occured', error: err });
  }
};

async function verifyStatus(req, res) {
  try {
    // Find the ad by its ID
    const adId = req.params.id; // Assuming you pass the ad ID as a route parameter
    const ad = await Ad.findById(adId);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Update the status to "verified"
    ad.status = 'VERIFIED';

    // Save the updated ad
    await ad.save();

    return res.status(200).json({ message: 'Status updated to verified' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function pausedStatus(req, res) {
  try {
    // Find the ad by its ID
    const adId = req.params.id; // Assuming you pass the ad ID as a route parameter
    const ad = await Ad.findById(adId);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    ad.status = 'STOPPED';

    // Save the updated ad
    await ad.save();

    return res.status(200).json({ message: 'Status updated to verified' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const { Storage } = require('@google-cloud/storage');

// Set up Google Cloud Storage
const storageClient = new Storage({
  keyFilename: path.join(__dirname, '..', '..', 'key.json'),
  projectId: 'scenic-sunspot-391708',
});
const bucketName = 'dframe-static-bucket';

// Create a new ad with image upload
const testCreateAd = async (req, res) => {
  try {
    const {
      clientId,
      campaignName,
      campaignType,
      adName,
      startDate,
      endDate,
      adContent,
      status,
      tags,
      adUrl,
      perDay,
      totalDays,
      bidAmount,
      adType,
    } = req.body;

    // Create a new ad instance
    console.log(clientId);
    const newAd = new Ad({
      clientId,
      campaignName,
      campaignType,
      adName,
      startDate,
      endDate,
      adContent,
      adUrl,
      status,
      tags,
      perDay,
      totalDays,
      bidAmount,
      adType,
    });
    let savedAd;
    // Upload the image to GCS

    if (req.file) {
      const originalFilename = req.file.originalname;
      const bucket = storageClient.bucket(bucketName);
      const filename = `${Date.now()}-${req.file.originalname.replace(
        / /g,
        '_'
      )}`; // Replace spaces with underscores
      const file = bucket.file(filename);
      const blobStream = file.createWriteStream();

      blobStream.on('error', (err) => {
        console.log('error in gcp', err);
        return res.status(500).json({ error: 'Error uploading image to GCS' });
      });

      blobStream.on('finish', async () => {
        // Set the image field to the GCS image URL
        newAd.image = `https://storage.googleapis.com/${bucketName}/${filename}`;
        console.log('this is new ad ', newAd);
        // Save the ad to the database
        savedAd = await newAd.save();
        console.log('This is the saved ad ', savedAd);
        try {
          let totalUser = newAd.perDay / newAd.bidAmount;
          let DframeUsers = await DframeUser.find();
          let matcheDframeUserIds = [];
          let i = 0;
          // while(totalUser>0){
          // const filteredUsers = DframeUsers.filter(duser => {
          //     return duser.userAds.some(adsObj => adsObj.ads.length === 0);
          //   })
          DframeUsers.forEach((duser) => {
            const userAdIndex = duser.userAds.findIndex(
              (entry) => entry.date === new Date().toLocaleDateString('en-GB')
            );
            if (userAdIndex !== -1) {
              // User has an entry for today's date, push the new
              duser.userAds[userAdIndex].ads.push({
                adsId: savedAd._id,
                rewards: newAd.bidAmount,
              });
            } else {
              // User doesn't have an entry for today's date, create a new entry
              duser.userAds.push({
                date: new Date().toLocaleDateString('en-GB'),
                ads: [{ adsId: savedAd._id, rewards: newAd.bidAmount }],
              });
            }
            // Save the updated user data
            duser.save();
            matcheDframeUserIds.push(duser._id);
            totalUser--;
          });
          i++;
          // }
          res.status(201).json({
            message: 'Post created successfully',
            id: matcheDframeUserIds,
          });
        } catch (err) {
          console.log(err);
          res.status(400).json({ message: 'Some error occured' });
        }
      });
      blobStream.end(req.file.buffer);
    } else {
      // Save the ad without an image
      console.log('ENTERED THIS FUNCTION');

      savedAd = await newAd.save();
      let totalUser = newAd.perDay / newAd.bidAmount;
      let DframeUsers = await DframeUser.find();
      let matcheDframeUserIds = [];
      let i = 0;
      DframeUsers.forEach((duser) => {
        const userAdIndex = duser.userAds.findIndex(
          (entry) => entry.date === new Date().toLocaleDateString('en-GB')
        );
        if (userAdIndex !== -1) {
          // User has an entry for today's date, push the new
          duser.userAds[userAdIndex].ads.push({
            adsId: savedAd._id,
            rewards: newAd.bidAmount,
          });
        } else {
          // User doesn't have an entry for today's date, create a new entry
          duser.userAds.push({
            date: new Date().toLocaleDateString('en-GB'),
            ads: [{ adsId: savedAd._id, rewards: newAd.bidAmount }],
          });
        }
        // Save the updated user data
        duser.save();
        matcheDframeUserIds.push(duser._id);
        totalUser--;
      });
      i++;
      res.status(201).json({
        message: 'Post created WITHOUT media',
        id: matcheDframeUserIds,
      });
    }
  } catch (error) {
    console.log('ERROR in CATCH', error);
    return res.status(500).json({ error: 'Error creating ad' });
  }
};

module.exports = {
  getAd,
  postAd,
  updateAd,
  deleteAd,
  upload,
  getAllClientDetails,
  adminUpdateAd,
  getAllAd,
  verifyStatus,
  pausedStatus,
  testCreateAd,
};
