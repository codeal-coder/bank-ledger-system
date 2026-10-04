const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
        FormAccount:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Account',
            required:[true,'Transaction must have a FormAccount'],
            index:true,
        },
        toAccount:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Account',
            required:[true,'Transaction must have a toAccount'],
            index:true,
        },
        status:{
            type:String,
            enum:{
              values:['PENDING','COMPLETED','FAILED','REVERSED'],
              message:'Transaction status must be one of PENDING,COMPLETED,FAILED,REVERSED',
            },
            default:'PENDING',
        },
        amount:{
            type:Number,
            required:[true,'Transaction amount is required'],
            min:[0,'Transaction amount must be greater than 0'],
        },
        idempotencyKey:{
            type:String,
            required:[true,'Idempotency key is required'],
            index:true, 
            unique:true,
        }

    },
    {
        timestamps:true,
    }
)



const transactionModal = mongoose.model('Transaction',transactionSchema);

module.exports = transactionModal;
