const { resolveContent } = require("nodemailer/lib/shared");
const Message=require("../models/messagemodel");
const User = require("../models/usermodel");
const Chat = require("../models/chatmodel");
exports.sendMessage=async(req, res)=>{
    const {content, chatId}= req.body;
    if(!content || !chatId){
        return res.status(400).json({
            success:false,
            message:"Enter complete data"
        })
    }
    var newMessage={
        sender: req.user._id,
        content: content,
        chat: chatId
    }
    try{
        var message=await Message.create(newMessage)
        message = await message.populate("sender");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path:"chat.users",
            select:"name pic email"
        })
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
        res.status(200).json({
            success:true,
            message
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:`Internal server error: ${error}`
        })
    }
}

exports.allMessages=async(req, res)=>{
    try {
        const message=await Message.find({chat: req.params.chatId}).populate("sender").populate("chat");
        res.status(200).json({
            success:true,
            message
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:`Internal server error: ${error}`
        })
    }
}