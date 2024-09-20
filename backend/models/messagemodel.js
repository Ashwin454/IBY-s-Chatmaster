const mongoose = require('mongoose');

const chatSchema=mongoose.Schema(
    {
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        content:{
            type:String,
        },
        chat: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Chat"
        }
    },
        {
            timestamps: true
        }
)

const ChatModel = mongoose.model("Message", chatSchema);

module.exports = ChatModel;