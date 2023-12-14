/** @format */

const express = require('express');
const router = express.Router();
const path = require('path'); // Import the path module
const transactionController = require(path.join(
  __dirname,
  '..',
  'controllers',
  'TransactionControllers'
));

// Create a new transaction
router.post('/transactions', transactionController.createTransaction);

// Get all transactions
router.get('/transactions', transactionController.getAllTransactions);

// Get a single transaction by ID
router.get('/transactions/:id', transactionController.getTransactionById);

router.put('/update', transactionController.updateStatusToCompleted);

router.get('/pending', transactionController.getPendingTransactions);
router.get(
  '/client/:clientId',
  transactionController.getTransactionsByClientId
);

// Update the status of a transaction
router.put(
  '/transactions/:id/status',
  transactionController.updateTransactionStatus
);

// Delete a transaction by ID
router.delete('/transactions/:id', transactionController.deleteTransaction);

module.exports = router;
