const userModal = require('../models/user.models');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const emailServices = require('../services/email.services');
const tokenBlacklistModal = require('../models/blacklist.models');
async function registerUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if the email already exists
    const existUser = await userModal.findOne({email});

    if(existUser){
        return res.status(422).json({ message: 'Email already exists',staus:"failed" });
    }

    const user =await userModal.create({name,email,password})
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'24h'})

    res.cookie('token',token,{httpOnly:true})
    res.status(201).json({message:"User registered successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
        },
        token
    })

    await emailServices.sendWelcomeEmail(user.email,user.name); 


}


async function loginUser(req, res) {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await userModal.findOne({email}).select('+password') ;
    if(!user){
        return res.status(404).json({ message: 'User not found',staus:"failed" });
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({ message: 'Password is incorrect',staus:"failed" });
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'24h'})
    res.cookie('token',token,{httpOnly:true})
    res.status(200).json({message:"User logged in successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
        },
        token
    })
}

async function userLogout(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(200).json({ message: 'user logout successfully' });
    }
    
    res.clearCookie('token');
    await tokenBlacklistModal.create({token});
    res.status(200).json({message:"User logged out successfully"});
}






module.exports = {
    registerUser,
    loginUser,
    userLogout
};