const express = require("express");

const router = express.Router();
const {authenticateToken} = require("../middleware/authMiddleware");
const {
    signup,
    login,
    allUsers
} = require("../controllers/userControllers");

router.post("/signup", signup);
router.post("/login", login);

router.get("/allUsers",authenticateToken , allUsers);

module.exports = router;