const accountModal = require('../models/account.models');

async function createAccounts(req,res){
    const user = req.user;

    const account = await accountModal.create({
        user:user._id,
    });
    res.status(201).json({message:'Account created successfully',account});
    
}

async function getUserAccount(req,res){
    const userAccount = await accountMode.find({user:req.user._id});

    res.status(200).json({
        userAccount
    })
}


async function getAccountBalance(req,res){
    const account = await accountModal.findOne({
        _id:req.params.accountId,
        user:req.user._id,
    });
    if(!account){
        return res.status(400).json({message:'Account not found'});
    }

    const balance = await account.getBalance();
    res.status(200).json({
        accountId:account._id,
        balance:balance,
    })
}


module.exports = {
    createAccounts,getUserAccount,getAccountBalance
}