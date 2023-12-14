const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/TransactionController');

// Create a new transaction
router.post('/transactions', transactionController.createTransaction); 

// Get all transactions
router.get('/transactions', transactionController.getAllTransactions);

// Get a single transaction by ID
router.get('/transactions/:id', transactionController.getTransactionById);

// Update the status of a transaction
router.put('/transactions/:id/status', transactionController.updateTransactionStatus);

// Delete a transaction by ID
router.delete('/transactions/:id', transactionController.deleteTransaction);

module.exports = router;
