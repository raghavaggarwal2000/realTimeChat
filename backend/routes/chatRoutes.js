const express = require("express");

const router = express.Router();
const { 
    accessChat,
    allChatsById,
    createGroupChat,
    renameGroupName,
    addToGroup,
    removeFromGroup
} = require("../controllers/chatController");

const { authenticateToken } = require("../middleware/authMiddleware");


router.post("/accessChat", authenticateToken, accessChat);
router.get("/allChatsById", authenticateToken, allChatsById);
router.post("/createGroupChat", authenticateToken, createGroupChat);
router.put("/renameGroupName", authenticateToken, renameGroupName);
router.put("/addToGroup", authenticateToken, addToGroup);
router.delete("/removeFromGroup", authenticateToken, removeFromGroup);

module.exports = router;