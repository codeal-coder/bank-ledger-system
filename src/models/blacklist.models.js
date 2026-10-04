const mongoose = require('mongoose');
const blackList  = new mongoose.Schema({
    token:{
        type:String,
        required:[true,'Token is required to blacklist'],
        unique:[true,'Token already blacklisted'],
    }
},{
    timestamps:true,
});


blackList.index({createdAt:1},{
    expireAfterSeconds:60*60*24*2, // 2 days
});

const tokenBlacklistModal = mongoose.model('blackList',blackList); 
module.exports = tokenBlacklistModal;
