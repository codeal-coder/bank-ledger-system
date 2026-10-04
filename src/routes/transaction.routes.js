const express = require('express');
const transactionController = require('../controllers/transaction.controllers');
const transactionRouter = express.Router();
const {authMiddleware,systemUserMiddleware} = require('../middlewares/auth.middlewares');

transactionRouter.post('/',authMiddleware,transactionController.createTransaction);
transactionRouter.post('/system/initial-fund',systemUserMiddleware,transactionController.createInitialTransaction);





module.exports = transactionRouter;
