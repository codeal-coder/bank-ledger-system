const transactionModal = require('../models/transaction.models');
const emailServices = require('../services/email.services');


async function createTransaction(req, res) {

    //validate request body
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const fromUserAccount = await accountModal.findOne({
        _id: fromAccount,
    });

    const toUserAccount = await accountModal.findOne({
        _id: toAccount,
    });

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({ message: 'From account or to account not found' });
    }

    //validate idempotency key
    const isTransactionAlreadyExist = await transactionModal.findOne({
        idempotencyKey,
    });
    if (isTransactionAlreadyExist) {
        if (isTransactionAlreadyExist.status === 'COMPLETED') {
            return res.status(200).json({ message: 'Transaction already processed' });
        }
        if (isTransactionAlreadyExist.status === 'PENDING') {
            return res.status(200).json({ message: 'Transaction already processing..' });
        }
        if (isTransactionAlreadyExist.status === 'FAILED') {
            return res.status(500).json({ message: 'Transaction processing failed' });
        }
        if (isTransactionAlreadyExist.status === 'REVERSED') {
            return res.status(500).json({ message: "Transaction was reversed,please try again later" });
        }
    }


    //check both account status is active
    if (fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE') {
        return res.status(400).json({ message: 'From account or to account is not active' });
    }

    // derived balance form ledger
    const balnce = await fromUserAccount.getBalance();

    if (balnce < amount) {
        return res.status(400).json({ message: `From account balance is not enough,available balance is ${balnce.toFixed(2)}` });
    }

    //create transaction

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = await transactionModal.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: 'PENDING',
    }, { session });

    const creditLedgerEntry = await ledgerModal.create({
        account: toAccount,
        type: 'CRIDIT',
        amount: amount,
        transaction: transaction._id,
    }, { session });

    const debitLedgerEntry = await ledgerModal.create({
        account: fromAccount,
        type: 'DEBIT',
        amount: amount,
        transaction: transaction._id,
    }, { session });

    transaction.status = 'COMPLETED';
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    //send email notification
    await emailServices.sendTransactionEmail(req.user.email, req.user.name, req.user.amount, req.user.toAccount);

    return res.status(200).json({ message: 'Transaction processed successfully' }, transaction);
}


async function createInitialTransaction(fromAccount, toAccount, amount, idempotencyKey) {
    const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const toUserAccount = await accountModal.findOne({
        _id: toAccount,
    });
    if (!toUserAccount) {
        return res.status(400).json({ message: 'To account not found' });
    }

    const fromUserAccount = await accountModal.findOne({
        user: req.user._id,
    });
    if (!fromUserAccount) {
        return res.status(400).json({ message: 'From account not found' });
    }
    let transaction;

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

         transaction = (await transactionModal.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: 'PENDING',
        }], { session }))[0];

        const debitLedgerEntry = await ledgerModal.create([{
            account: fromAccount,
            type: 'DEBIT',
            amount: amount,
            transaction: transaction._id,
        }], { session });

        await (() => {
            return new Promise(resolve => {
                setTimeout(resolve, 10000);
            })
        })
        const creditLedgerEntry = await ledgerModal.create([{
            account: toAccount,
            type: 'CRIDIT',
            amount: amount,
            transaction: transaction._id,
        }], { session });

        await transactionModal.findByIdAndUpdate(transaction._id, {
            status: 'COMPLETED',
        }, { session });

        await session.commitTransaction();
        session.endSession();
    } catch (err) {
        
        return res.status(500).json({ message: 'Transaction processing failed' });
    }

    return res.status(200).json({ message: 'Transaction processed successfully' }, transaction);
}


module.exports = {
    createTransaction,
    createInitialTransaction,
}
