const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

const sendMessage = async(req, res) =>{
    try{
        const {
            chatId,
            content
        } = req.body;

        if(!chatId || !content){
            return res.status(400).json({err: "data not passed"});
        }

        let newMessage = {
            sender: req.user._id,
            chat: chatId,
            content
        };

        let message = await Message.create(newMessage);
        
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");

        message = await User.populate(message,{
            path: "chat.users",
            select: "name pic email"
        });

        await Chat.findByIdAndUpdate(chatId, {
            $set:{ latestMessage : message._id}
        })

        res.status(200).json(message);


    }
    catch(err){
        res.status(400).json({err:err.message});
    }
}

const allMessages = async(req, res) =>{
    try{
        const chatId = req.params.chatId;
        const messages = await Message.find({chat: chatId})
        .populate("sender", "name pic email")
        .populate("chat");
        
        res.status(200).json(messages)
    }
    catch(err){
        res.status(400).json({err:err.message});
    }
}

module.exports = {
    sendMessage,
    allMessages
}