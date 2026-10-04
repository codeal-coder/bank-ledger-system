const userModal = require('../models/user.models');
const jwt = require('jsonwebtoken');
const tokenBlacklistModal = require('../models/blacklist.models');


async function authMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Please login to access this resource'});
    }
    const blacklisted = await tokenBlacklistModal.findOne({token});
    if(blacklisted){
        return res.status(401).json({message:'Token is blacklisted'});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await userModal.findById(decoded.id);
        next();
    }catch(err){
        return res.status(401).json({message:'Invalid token'});
    }
}


async function systemUserMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(403).json({message:'System users cannot access this resource'});
    }
    const blacklisted = await tokenBlacklistModal.findOne({token});
    if(blacklisted){
        return res.status(403).json({message:'Token is blacklisted'});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModal.findById(decoded.id).select("+systemUser");
        if(!user.systemUser){
            return res.status(403).json({message:'System users cannot access this resource'});
        }

        req.user = user;
    
        next();
    }catch(err){
        return res.status(403).json({message:'Invalid token'});
    }

}

module.exports = authMiddleware;