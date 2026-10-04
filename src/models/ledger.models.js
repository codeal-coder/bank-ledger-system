const mongoose = require('mongoose');   


const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Account',
        required:[true,'Ledger must have a account'],
        index:true,
        immutable:true,
    },
    amount:{
        type:Number,
        required:[true,'Amount is required for create ledger'],
        immutable:true,
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Transaction',
        required:[true,'Ledger must have a transaction'],
        index:true,
        immutable:true,
    },
    type:{
        type:String,
        enum:{
            values:['DEBIT','CREDIT'],
            message:'Ledger type must be one of DEBIT,CREDIT',
        },
        default:'DEBIT',
    },
        
    
},
{
    timestamps:true,
})


function preventLedgerFromModification(){
    throw new Error('Ledger cannot be modified');
}


ledgerSchema.pre('updateOne',preventLedgerFromModification);
ledgerSchema.pre('deleteOne',preventLedgerFromModification);
ledgerSchema.pre('findOne',preventLedgerFromModification);
ledgerSchema.pre('findOneAndUpdate',preventLedgerFromModification);
ledgerSchema.pre('updateMany',preventLedgerFromModification);
ledgerSchema.pre('deleteMany',preventLedgerFromModification);
ledgerSchema.pre('remove',preventLedgerFromModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerFromModification);
ledgerSchema.pre('findOneAndReplace',preventLedgerFromModification);


const ledgerModal = mongoose.model('Ledger',ledgerSchema);
module.exports = ledgerModal;