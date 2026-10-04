const mongoose = require('mongoose');
const ledgerModal = require('./ledger.models');

const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'Account must associated with a user'],
        index:true,
    },
    status:{
        type:String,
        enum:{
            values:['ACTIVE','FROZEN','CLOSED'],
            message:'Account status must be one of ACTIVE,FROZEN,CLOSED',
        },
        default:'ACTIVE' 
    },
    currency:{
        type:String,
        required:[true,'Currency is required for Account'],
        default:'INR',
    }

},{
    timestamps:true,
});

accountSchema.index({user:1,status:1});

accountSchema.methods.getBalance =async function(){
    const balnceData = await ledgerModal.aggregate([
        {
            $match:{
                account:this._id,
            }
        },
        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            {$eq:['$type','DEBIT']},
                            '$amount',
                            0,
                        ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            {$eq:['$type','CRIDIT']},
                            '$amount',
                            0,
                        ]
                    }
                },
            }
        },
        {
            $project:{
                balance:{
                    $subtract:['$totalDebit','$totalCredit'],
                }
            }
        }
    ]);
    if(balnceData.length === 0){
        return 0;
    }
    return balnceData[0].balance;
}

const accountModal = mongoose.model('Account',accountSchema);

module.exports = accountModal;
