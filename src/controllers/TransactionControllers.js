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
    const { clientId } = req.params;
    console.log('clientId:', clientId);

    const transactions = await Transaction.find({ to: clientId });
    console.log('Transactions:', transactions);

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
