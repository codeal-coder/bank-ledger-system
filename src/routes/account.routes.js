const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const accountControllers = require('../controllers/account.controllers');       




router.post('/create',authMiddleware,accountControllers.createAccounts);


router.get('/user',authMiddleware,accountControllers.getUserAccount);

router.get('/:accountId/balance',authMiddleware,accountControllers.getAccountBalance);


module.exports = router;