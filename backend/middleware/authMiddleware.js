const User = require("../models/user");
const { verifyJWT } = require("../utils/jwt");


const authenticateToken = async (req, res, next) =>{
    try{
        if(req.headers.authorization && 
            req.headers.authorization.startsWith("Bearer")){
            const token = req.headers.authorization.split(" ")[1];
            
            const decodedData = verifyJWT(token);
            if(!decodedData){
                throw new Error("Invalid token");
            }
            const users = await User.findById(decodedData.id).select("-password");
            req.user = users;

        }else{  
            throw new Error("Token doesn't exist");
        }

        return next();

    }
    catch(err){
        console.log(err);
        return res.status(401).json({err: err.message});
    }
}


module.exports = {
    authenticateToken
}