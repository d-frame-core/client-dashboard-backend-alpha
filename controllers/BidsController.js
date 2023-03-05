const Bid = require("../models/BidsModel");
const Ad = require("../models/AdsModel");
const User = require("../models/UsersModel");

function gettingUsers(users, noOfBids, bidRank) {
  let no_of_users = users;
  let x = users; // total users
  let y = noOfBids; // total bids // we can only allow max of 50 clients in one bid
  let sno = 1;
  let ratios = [];

  function divideIntoRatios(total, ratios) {
    console.log("total no of users inside divideIntoRatios", total);
    let result = [];
    let sum = ratios.reduce((a, b) => a + b, 0);
    console.log("sum of the values inside ratios", sum);
    for (let i = 0; i < ratios.length; i++) {
      let value = Math.floor((ratios[i] / sum) * total);
      if (value > 200) {
        value = 200;
        result.push(value);
      } else {
        result.push(value);
      }
    }
    return result;
  }

  for (i = 0; i < y; i++) {
    let a = Math.floor(no_of_users / 10);
    ratios.push(a);
    console.log(sno, a);
    no_of_users -= a;
    sno++;
  }
  console.log(ratios);

  let assignedUserToBid = divideIntoRatios(x, ratios)[bidRank - 1];
  console.log("assigned users to the bid", assignedUserToBid);

  return assignedUserToBid;
}

const getBids = async (req, res) => {
  try {
    const getBids = await Bid.find({}, { bidAmount: 1 }).sort({
      bidAmount: -1,
    });
    if (getBids) {
      res.status(200).json(getBids);
    } else {
      res.status(200).json("No bids found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getBid = async (req, res) => {
  try {
    const foundBid = await Bid.find({ clientId: req.params.id });
    if (foundBid.length) {
      res.status(200).json(foundBid);
    } else {
      res.status(200).json({ message: "No bid found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateBid = async (req, res) => {
  const clientId = req.params.id;
  const bidAmount = req.body.bidAmount;

  try {
    await Bid.deleteOne({ clientId: clientId }, (err) => {
      // if (!err) {
      //   res.status(200).json({ message: "Deleted Successfully" });
      // }
    });
  } catch (err) {
    // res.status(500).json({ message: "Error Occured", error: err });
    console.log(err);
  }

  const newBid = new Bid({
    clientId,
    campaignBudget: {
      perDay: req.body.perDay,
      totalDays: req.body.totalDays,
    },
    bidAmount,
  });

  try {
    const savedBid = await newBid.save();
    console.log(savedBid);

    const result = await Bid.aggregate([
      { $sort: { bidAmount: -1 } },
      {
        $group: {
          _id: null,
          clientIds: { $push: "$bidAmount" },
        },
      },
    ]);
    console.log(result[0].clientIds);

    let rank = result[0].clientIds.indexOf(bidAmount) + 1;
    console.log("rank: ", rank);

    const users = await User.countDocuments();
    console.log("no of users in log", users);

    const bids = await Bid.countDocuments();
    console.log("no of bids in log", bids);

    console.log(users);
    console.log(bids);
    console.log(rank);
    let assignedUsers = gettingUsers(users, bids, rank)
    console.log(assignedUsers);

    Ad.updateOne(
      { _id: clientId },
      {
        $set: {
          users: { $slice: assignedUsers },
          assignedUsers: assignedUsers,
        },
      }
    );

    res.status(201).json({ message: "post updated", savedBid });
  } catch (err) {
    res.status(500).json({ message: "Error Occured", error: err });
  }
};

const deleteBid = async (req, res) => {
  try {
    Bid.deleteOne({ clientId: req.params.id }, (err) => {
      if (!err) {
        res.status(200).json({ message: "Deleted Successfully" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error Occured", error: err });
  }
};

const postBid = async (req, res) => {
  const bidAmount = req.body.bidAmount;
  const clientId = req.body.clientId;
  const newBid = new Bid({
    clientId,
    campaignBudget: {
      perDay: req.body.perDay,
      totalDays: req.body.totalDays,
    },
    bidAmount,
  });

  try {
    const savedBid = await newBid.save();
    console.log(savedBid);

    const result = await Bid.aggregate([
      { $sort: { bidAmount: -1 } },
      {
        $group: {
          _id: null,
          clientIds: { $push: "$bidAmount" },
        },
      },
    ]);
    console.log(result[0].clientIds);

    let rank = result[0].clientIds.indexOf(bidAmount) + 1;
    console.log("rank: ", rank);

    const users = await User.countDocuments();
    console.log("no of users in log", users);

    const bids = await Bid.countDocuments();
    console.log("no of bids in log", bids);

    console.log(users);
    console.log(bids);
    console.log(rank);
    let assignedUsers = gettingUsers(users, bids, rank)
    console.log(assignedUsers);

    Ad.updateOne(
      { _id: clientId },
      {
        $set: {
          users: { $slice: assignedUsers },
          assignedUsers: assignedUsers,
        },
      }
    );

    res.status(201).json({ message: "post created", savedBid });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "some error occured", err: err });
  }
};

module.exports = {
  getBids,
  getBid,
  postBid,
  updateBid,
  deleteBid,
};
