const express = require("express");
const router = express.Router();

const {
    sendMessage,
    allMessages
} = require("../controllers/messageController");

const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/sendMessage", authenticateToken, sendMessage);
router.get("/:chatId", authenticateToken, allMessages);

module.exports = router;