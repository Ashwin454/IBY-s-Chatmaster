const express= require('express');
const { isAuthenticated } = require('../middleware/auth');
const { sendMessage, allMessages } = require('../controller/messageController');

const router=express.Router();

router.route("/").post(isAuthenticated, sendMessage);
router.route('/:chatId').get(isAuthenticated, allMessages);

module.exports=router;