/** @format */

// AD history
// Analytics

const Ad = require('../models/AdsModel');
const multer = require('multer');
const path = require('path');
const User = require('../models/UsersModel');
const DframeUser = require('../models/DframeUserModel');

let fileName;

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
            gender: req.body.gender
        },
        image: req.body.image,
        adContent: req.body.adContent,
        tags: req.body.tags,
        perDay:req.body.perDay,
        totalDays:req.body.totalDays,
        bidAmount:req.body.bidAmount,

    })
    try {
        const savedAd = await newAd.save();
        let totalUser=newAd.perDay/newAd.bidAmount;
        let DframeUsers= await DframeUser.find() ;
        let matcheDframeUserIds = []
        let i=0;
        // while(totalUser>0){
            // const filteredUsers = DframeUsers.filter(duser => {
            //     return duser.userAds.some(adsObj => adsObj.ads.length === 0);
            //   })
            DframeUsers.forEach((duser) => { 
                const userAdIndex = duser.userAds.findIndex((entry) => entry.date === newAd.startDate);
                if (userAdIndex !== -1) {
                    // User has an entry for today's date, push the new 
                    duser.userAds[userAdIndex].ads.push({ adsId: savedAd._id, rewards: newAd.bidAmount });
                } else {
                    // User doesn't have an entry for today's date, create a new entry
                    duser.userAds.push({ date: newAd.startDate, ads: [{ adsId: savedAd._id, rewards: newAd.bidAmount }] });
                }
                // Save the updated user data
                duser.save();
                matcheDframeUserIds.push(duser._id);
                totalUser--;
            })
            i++;
        // }
        res.status(201).json({message: "Post created successfully", id: matcheDframeUserIds})
    } catch (err){
        console.log(err);
        res.status(400).json({message: "Some error occured"})
    }
}

const updateAd = (req, res) => {
  try {
    Ad.updateOne({ adId: req.params.id }, { $set: req.body }, (err) => {
      if (!err) {
        res.status(200).json({ message: 'Updated Successfully' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error Occured', error: err });
  }
};

const getAllClientDetails = async (req, res) => {
  const clientId = req.params.id;
  try {
    const clientDetails = await Ad.find({ clientId: clientId });
    res.status(200).json(clientDetails);
  } catch (err) {
    res.status(500).json({ message: 'Error Occured', error: err });
  }
};

const deleteAd = (req, res) => {
  try {
    Ad.deleteOne({ adId: req.params.id }, (err) => {
      if (!err) {
        res.status(200).json({ message: 'Deleted Successfully' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error Occured', error: err });
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
    ad.status = 'verified';

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

    // Update the status to "verified"
    ad.status = 'paused';

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
  keyFilename: path.join(__dirname, '..', 'key.json'),
  projectId: process.env.GCP_PROJECTID,
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
    } = req.body;

    // Create a new ad instance
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
        newAd.image = `https://storage.cloud.google.com/${bucketName}/${filename}?authuser=2`;

        // Save the ad to the database
        savedAd = await newAd.save();

      });
      blobStream.end(req.file.buffer);
    } else {
      // Save the ad without an image
      savedAd = await newAd.save();
    }

    try {
       let totalUser=newAd.perDay/newAd.bidAmount;
        let DframeUsers= await DframeUser.find() ;
        let matcheDframeUserIds = []
        let i=0;
        // while(totalUser>0){
            // const filteredUsers = DframeUsers.filter(duser => {
            //     return duser.userAds.some(adsObj => adsObj.ads.length === 0);
            //   })
            DframeUsers.forEach((duser) => { 
                const userAdIndex = duser.userAds.findIndex((entry) => entry.date === newAd.startDate);
                if (userAdIndex !== -1) {
                    // User has an entry for today's date, push the new 
                    duser.userAds[userAdIndex].ads.push({ adsId: savedAd._id, rewards: newAd.bidAmount });
                } else {
                    // User doesn't have an entry for today's date, create a new entry
                    duser.userAds.push({ date: newAd.startDate, ads: [{ adsId: savedAd._id, rewards: newAd.bidAmount }] });
                }
                // Save the updated user data
                duser.save();
                matcheDframeUserIds.push(duser._id);
                totalUser--;
            })
            i++;
        // }
            res.status(201).json({message: "Post created successfully", id: matcheDframeUserIds})
        } catch (err){
            console.log(err);
            res.status(400).json({message: "Some error occured"})
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
