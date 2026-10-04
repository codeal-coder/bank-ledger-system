const express = require('express');
const router = express.Router();
const { registerUser, loginUser,userLogout } = require('../controllers/auth.controllers');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', userLogout);


module.exports = router; 
