const Chat = require("../models/chat");
const User = require("../models/user");

const accessChat = async (req, res)  =>{
    console.log("here");
    try{
        const {userId} = req.body;

        if(!userId){
            throw new Error("Userid is not send with the body");
        }

        var isChat = await Chat.find(
            {
                isGroupChat: false,
                users: { $all : [req.user._id, userId ]}
                // $and: [
                //     {users: {$elemMatch: {$eq: req.user._id }}},
                //     {users: {$elemMatch: {$eq: userId }}}
                // ]
            }
        ).populate("users", "-password").populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email"
        });

        if(isChat.length >0){
            res.status(201).send(isChat[0]);
        }else{
            let chatData = {
                chatName:"sender",
                isGroupChat: "false",
                users: [req.user._id, userId]
            };
            const created = await Chat.create(chatData);
            
            const fullChat = await Chat.findOne({_id: created._id}).populate("users", "-password");
            
            res.status(200).send(fullChat);
        }

    }
    catch(err){
        res.status(400).json({err: err.message});
    }
};


const allChatsById = async (req, res)  =>{
    try{
        Chat.find({
            users:{
                $elemMatch: { $eq :  req.user._id}
            }
        })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async (result) =>{
            const results = await User.populate(result, {
            path: "latestMessage.sender",
            select: "name pic email"
            });
            res.status(200).json(results);
        })

        
    }
    catch(err){
        res.status(403).json({err: err.message});
    }
};


const createGroupChat = async (req, res)  =>{
    try{
        let {
            name,
            users
        } = req.body;

        if(!name || !users){
            throw new Error("Please Fill all the fields");
        }

        users = JSON.parse(users);
        users.push(req.user);
        if(users.length < 2){
            throw new Error("Group should have more than 2 users");
        }

        const groupChat = await Chat.create({
            chatName: name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });

        const fullGroupChat = await Chat.find(groupChat._id)
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.status(201).json(fullGroupChat);
    

        
    }
    catch(err){
        res.status(400).json({err: err.message});
    }
};

const renameGroupName = async (req, res)  =>{
    try{
        const {chatId, chatName} = req.body;

        const updated = await Chat.findByIdAndUpdate(chatId, {
            chatName
        }, {new:true})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        if(!updated)
            throw new Error("This chat doesn't exist");
        res.status(200).json(updated);
    }
    catch(err){
        res.status(400).json({err: err.message});
    }
};


const addToGroup = async (req, res)  =>{
    try{
        const {
            chatId,
            userId
        } = req.body; 

        const check = await Chat.count({
            _id: chatId,
            users: { $in: [userId]}
        });
        
        if(check){
            throw new Error("This user already exists in the group");
        }

        const added = await Chat.findByIdAndUpdate(chatId, {
            $push: {users: userId}
        }, {new:true})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        if(!added)
            throw new Error("Chat not found");
        res.status(200).json(added)
    }
    catch(err){
        res.status(400).json({err: err.message});
    }
};

const removeFromGroup = async (req, res)  =>{
    try{
        const {
            chatId,
            userId
        } = req.body; 

        const removed = await Chat.findByIdAndUpdate(chatId, {
            $pull: {users: userId}
        }, {new:true})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        if(!removed)
            throw new Error("Chat not found");
        res.status(200).json(removed)
    }
    catch(err){
        res.status(400).json({err: err.message});
    }
};
module.exports = {
    accessChat,
    allChatsById,
    createGroupChat,
    renameGroupName,
    addToGroup,
    removeFromGroup
};