const jwt = require("jsonwebtoken");


const generateJWT = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "15d"
    })
}

const verifyJWT = (token) =>{
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
}

module.exports = {generateJWT, verifyJWT};