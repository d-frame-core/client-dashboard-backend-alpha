/** @format */

const path = require('path'); // Import the path module
const DframeUser = require(path.join(
  __dirname,
  '..',
  'models',
  'DframeUserModel'
));
const { default: Web3 } = require('web3');
const RewardRequest = require('../models/reward.model');
const DFrameUser = require('../models/DframeUserModel');
// const EthereumTx = require('ethereumjs-tx').Transaction;
// const Common = require('ethereumjs-common').default;
require('dotenv').config();

const Web3js = new Web3(
  `https://polygon-mainnet.infura.io/v3/951e68a3953c4684a4979f33ff797377`
);

const privateKey = '';
// const fromAddress = '0x5Ef4331edbBFEE33e6fAD52Fe77cd504b5b54f29';
// const toAddress = '0x49a1A6aC07fa525359f967EF055EB844b168E9ff';
const contractAddress = '0x0B6163c61D095b023EC3b52Cc77a9099f6231FCC';
// const amountToSend = 10; // Amount of tokens to transfer
const dframeABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'Snapshot',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'snapshotId', type: 'uint256' },
    ],
    name: 'balanceOfAt',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'snapshot',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'snapshotId', type: 'uint256' }],
    name: 'totalSupplyAt',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const sendTokens = async (req, res) => {
  console.log('Sending tokens');
  // const contract = new web3.eth.Contract(dframeABI, contractAddress);
  const { walletAddress, privateKey, amountToTransfer, rewardId, fromAddress } =
    req.body;

  console.log('Wallet Address: ', walletAddress);
  console.log('Private Key: ', privateKey);
  console.log('amount: ', amountToTransfer);
  console.log('Reward: ', rewardId);
  console.log('From Address: ', fromAddress);

  let contract = new Web3js.eth.Contract(dframeABI, contractAddress, {
    from: fromAddress,
  });
  try {
    const reward = RewardRequest.findById(rewardId);

    // Get the current date and the first day of the previous month
    const currentDate = new Date();
    // Adjust currentDate to be one day before the actual current date
    currentDate.setDate(currentDate.getDate() - 1);

    const firstDayOfPreviousMonth = new Date();
    firstDayOfPreviousMonth.setMonth(firstDayOfPreviousMonth.getMonth() - 1);
    firstDayOfPreviousMonth.setDate(1);
    firstDayOfPreviousMonth.setHours(0, 0, 0, 0);

    // Query users with rewards data
    const user = await DframeUser.findOne({ publicAddress: walletAddress });

    // // Calculate one-time rewards for the user
    // const userOneTimeRewards =
    //   user.rewards.oneTime.kyc1.rewards +
    //     user.rewards.oneTime.kyc2.rewards +
    //     user.rewards.oneTime.kyc3.rewards || 2;

    // // Calculate daily rewards for the user
    // let userDailyRewards = 0;
    // user.rewards.daily.forEach((dailyEntry) => {
    //   dailyEntry.browserData.forEach((entry) => {
    //     userDailyRewards += entry.rewards;
    //     console.log('daily data for user', user._id);
    //   });

    //   dailyEntry.ad.forEach((entry) => {
    //     userDailyRewards += entry.rewards;
    //   });

    //   dailyEntry.survey.forEach((entry) => {
    //     userDailyRewards += entry.rewards;
    //   });

    //   dailyEntry.referral.forEach((entry) => {
    //     userDailyRewards += entry.rewards;
    //   });
    // });

    try {
      console.log('Entering transaction');
      // const amountToSend = userOneTimeRewards + userDailyRewards; // Replace with the actual amount of tokens you want to send
      console.log('amount to send ', amountToTransfer);
      // const amount = Web3js.utils.toHex(
      //   Web3js.utils.toWei(amountToTransfer.toString(), 'wei')
      // ); // Convert amount to Wei
      const amountInWei = Web3js.utils.toWei(
        amountToTransfer.toString(),
        'ether'
      );
      console.log('amount in wei ', amountInWei);
      const data = contract.methods
        .transfer(user.publicAddress, amountInWei)
        .encodeABI();
      const gasPrice = await Web3js.eth.getGasPrice();
      const gasLimit = 100000; // You may need to adjust this based on the token contract
      let nonce = await Web3js.eth.getTransactionCount(fromAddress);
      nonce++;
      console.log(Web3js.utils.toHex(nonce));
      const txObj = {
        // nonce: Web3js.utils.toHex(nonce),
        gasPrice: Web3js.utils.toHex(gasPrice),
        gasLimit: Web3js.utils.toHex(gasLimit),
        to: contractAddress,
        value: '0x00',
        data: data,
        from: fromAddress,
      };

      console.log('txObj is', txObj);
      const signedTx = await Web3js.eth.accounts.signTransaction(
        txObj,
        privateKey
      );

      console.log('signed tx is', signedTx);
      // const transaction = await Web3js.eth.sendSignedTransaction(
      //   signedTx.rawTransaction
      // );
      // console.log('Transaction hash:', transaction.transactionHash);

      const startingDate = new Date('2023-01-01').toLocaleDateString('en-GB'); // Replace with your actual starting date
      const previousMonthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      ).toLocaleDateString('en-GB');

      // Update status of one-time rewards
      await DFrameUser.updateMany(
        {
          $or: [
            { 'rewards.oneTime.kyc1.status': 'UNPAID' },
            { 'rewards.oneTime.kyc2.status': 'UNPAID' },
            { 'rewards.oneTime.kyc3.status': 'UNPAID' },
          ],
        },
        {
          $set: {
            'rewards.oneTime.kyc1.status': 'PAID',
            'rewards.oneTime.kyc2.status': 'PAID',
            'rewards.oneTime.kyc3.status': 'PAID',
          },
        }
      );

      // Update status of daily rewards
      await DFrameUser.updateMany(
        {
          'rewards.daily.date': {
            $gte: startingDate,
            $lte: previousMonthDate,
          },
        },
        { $set: { 'rewards.daily.$.status': 'PAID' } }
      );

      await reward.updateOne({
        status: 'COMPLETED',
      });
      res.status(201).send('Transaction sent successfully!');
    } catch (error) {
      console.error('Error sending transaction:', error);
      res.status(500).send('Error sending transaction');
    }
    // Send the array as a response
    // res.json({ message: 'Tokens sent successfully!' });
  } catch (error) {
    console.error('Error calculating total rewards:', error);
    res.status(500).json({ error: 'Error calculating total rewards' });
  }
};

//Get all detail
const getUser = async (req, res) => {
  try {
    const foundUser = await DframeUser.find();
    console.log('checking for user');

    if (foundUser) {
      res.status(200).json(foundUser);
    } else {
      res.status(200).json('No User Found');
    }
  } catch (err) {
    res.status(500).json({ message: 'Error Occured' });
  }
};

//Get detail by id
const getUserbyid = (req, res) => {
  const clientId = req.params.id;
  DframeUser.findById(clientId)
    .then((foundUser) => {
      if (foundUser) {
        res.status(200).json(foundUser);
      } else {
        res.status(200).json('No User Found');
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error Occured' });
    });
};

const updateUser = (req, res) => {
  try {
    DframeUser.updateOne({ _id: req.params.id }, { $set: req.body }, (err) => {
      if (!err) {
        res.status(200).json({ message: 'Updated Successfully' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error Occures', error: err });
  }
};

const deleteUser = (req, res) => {
  try {
    DframeUser.deleteOne({ userId: req.params.id }, (err) => {
      if (!err) {
        res.status(200).json('Deleted Successfully');
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'ERROR Occured', error: err });
  }
};

const adminUpdateUser = (req, res) => {
  try {
    DframeUser.updateOne(
      { _id: req.params.id },
      { $set: { Status: req.body.status } },
      (err) => {
        if (!err) {
          res.status(200).json({ message: 'Updated Successfully' });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Error Occures', error: err });
  }
};

module.exports = {
  getUser,
  getUserbyid,
  updateUser,
  deleteUser,
  adminUpdateUser,
  sendTokens,
};
