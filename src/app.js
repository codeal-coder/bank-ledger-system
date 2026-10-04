const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const accountRoutes = require('./routes/account.routes');
const transactionRoutes = require('./routes/transaction.routes');
const cookieParser = require('cookie-parser');
// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());


// Use the authentication routes
app.use('/api/auth', authRoutes);
// Use the account routes
app.use('/api/accounts', accountRoutes);
// Use the transaction routes
app.use('/api/transactions', transactionRoutes);
// Use the transaction routes
// app.use('/api/ledger', ledgerRoutes);



module.exports = app;