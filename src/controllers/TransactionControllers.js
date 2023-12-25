/** @format */

const mongoose = require('mongoose');
const path = require('path'); // Import the path module
const UsersModel = require(path.join(__dirname, '..', 'models', 'UsersModel'));
const nodemailer = require('nodemailer');
const Transaction = require(path.join(
  __dirname,
  '..',
  'models',
  'Transaction'
));
const DframeUser = require(path.join(
  __dirname,
  '..',
  'models',
  'DframeUserModel'
));

require('dotenv').config();
// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
};

exports.getPendingTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      status: { $regex: /^pending$/i },
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve pending transactions' });
  }
};

exports.updateStatusToCompleted = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      to: { $exists: true, $ne: null },
    });
    for (const transaction of transactions) {
      if (transaction.to instanceof mongoose.Types.ObjectId) {
        transaction.status = 'COMPLETED';
        await transaction.save();
      }
    }
    console.log('completed');
    res.status(200).json({
      message: 'Status updated to COMPLETED for eligible transactions',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update transaction status' });
  }
};
exports.getTransactionsByClientId = async (req, res) => {
  try {
    const clientId = req.params.id;

    const transactions = await Transaction.find({
      to: clientId,
      status: 'COMPLETED',
    });

    if (transactions.length === 0) {
      res.status(200).json(null);
    } else {
      res.status(200).json(transactions);
    }
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve transaction' });
  }
};

exports.checkUnderReviewTransaction = async (req, res) => {
  try {
    const clientId = req.params.id;

    const transaction = await Transaction.findOne({
      to: clientId,
      status: 'UNDERREVIEW',
    });
    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Failed to check transaction status' });
  }
};

// Assuming you are using Express framework
exports.removeToAndChangeStatus = async (req, res) => {
  const clientId = req.params.id;
  const transactionId = req.body.transactionId;

  try {
    // Assuming TransactionModel is the model representing your transactions
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update the transaction
    transaction.to = null; // Set to null instead of empty string
    transaction.status = 'PENDING';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dframe.org@gmail.com',
        pass: process.env.pass,
      },
    });
    const client = await UsersModel.findById(clientId);
    const user = await DframeUser.findById(transaction.from.toString());

    const mailOptions = {
      from: 'dframe.org@gmail.com',
      to: user.kyc1.details.email,
      subject: 'Bid Cancelled',
      text: `The client ${client.companyName} has cancelled the bid on your ad of ${transaction.amount} DFT which was created on ${transaction.createdAt}. Contact us at <dframe.org@gmail.com> if you have any questions.`,
    };

    await transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Email failed' });
      }

      await transaction.save();

      res.status(200).json({ message: 'Transaction updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateTransactionForClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const { transactionId } = req.body;
    console.log('clientId:', clientId);
    console.log('transactionId:', transactionId);

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    transaction.to = clientId;
    transaction.status = 'UNDERREVIEW';
    transaction.updatedAt = new Date();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dframe.org@gmail.com',
        pass: process.env.pass,
      },
    });
    console.log('From:', transaction.from);
    const user = await DframeUser.findById(transaction.from.toString());

    const mailOptions = {
      from: 'dframe.org@gmail.com',
      to: user.kyc1.details.email,
      subject: 'New Bid',
      text: `A new bid has been placed on your ad for SELL DFT of amount ${transaction.amount} created on ${transaction.createdAt}. Please review it for now. Our representative will contact you soon to discuss the process.`,
    };

    await transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Email failed' });
      }

      await transaction.save();

      res.status(200).json({ message: 'Transaction updated successfully' });
    });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

// Update the status of a transaction
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction status' });
  }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
