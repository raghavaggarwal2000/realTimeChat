const User = require("../models/user");
const {generateJWT} = require("../utils/jwt");

const signup = async (req, res) =>{
    try{
        console.log(req.body);
        const {
            name,
            email,
            password,
        } = req.body;

        const pic  = req.body.pic || "";

        if(!name || !email || !password){
            throw new Error("Please enter all the fields");
        }
        console.log(pic);
        const user = await User.create({name, email, password, pic: pic.length > 0? pic: undefined });
        res.status(201).json({
            status: "OK", 
            message:"User created successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateJWT(user._id),
        });
    }
    catch(err){
        res.status(401).json({
            err: err.code? "This email already exists" :err.message
        });
    }
};

const login = async (req, res) => {
    try{
        const {
            email,
            password
        } = req.body;
        if(!email || !password){
            throw new Error("Enter all the fields");
        }
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("This accout doesn't exist");
        }

        const check = await user.matchPassword(password);
        if(!check){
            throw new Error("Email or Password is wrong");
        }

         res.status(201).json({
            status: "OK", 
            message:"Login successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateJWT(user._id),
        });

    }
    catch(err){        
        res.status(401).json({
            err: err.message
        });
    }
};

// route /user/allUsers?search=piyush
const allUsers = async (req, res) =>{
    try{
        const keyword = req.query.search
        ?{
            $or:[
                {name: {$regex: req.query.search, $options: "i"}},
                {email: {$regex: req.query.search, $options: "i"}}
            ]
        }
        :{};
        
        const users = await User.find(keyword).find({_id: {$ne:req.user._id}}).select("-password");
        res.status(200).send(users);
    }
    catch(err){
        res.status(400).json({err:err.message});
    }
}


module.exports = {
    signup,
    login,
    allUsers
}