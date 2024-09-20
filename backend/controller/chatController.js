const ChatModel = require("../models/chatmodel");
const chat = require("../models/chatmodel");
const user = require("../models/usermodel");

exports.accessChat = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const user1 = await user.findOne({ _id: userId });
        if (!user1) {
            return res.status(400).json({
                success: false,
                message: "Invalid request"
            });
        }
        var chat1 = null;
        chat1 = await chat.findOne({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ]
        }).populate("users").populate("latestMessage").populate("groupAdmin"); // Added populate("groupAdmin")
        if (chat1 != null) {
            return res.status(200).json({
                success: true,
                chat1
            });
        }
        const newChat = await chat.create({
            chatName: "single",
            isGroupChat: false,
            users: [req.user._id, userId]
        });
        const fullNew = await chat.findOne({
            _id: newChat._id
        }).populate("users").populate("groupAdmin"); // Added populate("groupAdmin")
        return res.status(200).json({
            success: true,
            chat: fullNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error}`
        });
    }
};

exports.getConnChats = async (req, res, next) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid request"
            });
        }
        const AllChats = await chat.find({ users: { $in: [userId] } })
            .populate("users").populate("groupAdmin").populate("latestMessage"); // Added populate("groupAdmin")
        if (AllChats.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No chats"
            });
        }
        return res.status(200).json({
            success: true,
            AllChats
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Some error occurred: ${error}`
        });
    }
};

exports.createGroupChat = async (req, res, next) => {
    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).json({
                success: false,
                message: "Fill complete details"
            });
        }
        var users = req.body.users;
        if (users.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Users too less"
            });
        }
        users.push(req.user);
        const groupChat = await chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });
        const fullGC = await chat.findOne({ _id: groupChat._id })
            .populate("users").populate("groupAdmin"); // Already present here
        res.status(200).json({
            success: true,
            chat: fullGC
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error}`
        });
    }
};

exports.renameGroup = async (req, res, next) => {
    try {
        const { chatId, chatName } = req.body;

        const updatedChat = await chat.findByIdAndUpdate(
            chatId,
            {
                chatName
            },
            {
                new: true
            }
        ).populate("users").populate("groupAdmin"); // Already present here
        return res.status(200).json({
            success: true,
            chat: updatedChat
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error}`
        });
    }
};

exports.addToGC = async (req, res, next) => {
    try {
        const { chatId, userId } = req.body;

        if (!chatId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Enter complete data"
            });
        }

        const added = await chat.findByIdAndUpdate(
            chatId,
            { $addToSet: { users: userId } },
            { new: true }
        ).populate("users").populate("groupAdmin"); // Already present here

        if (!added) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        res.status(200).json({
            success: true,
            chat: added
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error}`
        });
    }
};

exports.removeFromGC = async (req, res, next) => {
    try {
        const { chatId, userId } = req.body;

        if (!chatId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Enter complete data"
            });
        }

        const removed = await chat.findByIdAndUpdate(
            chatId,
            { $pull: { users: userId } },
            { new: true }
        ).populate("users").populate("groupAdmin"); // Added populate("groupAdmin")

        if (!removed) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        res.status(200).json({
            success: true,
            chat: removed
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error}`
        });
    }
};
