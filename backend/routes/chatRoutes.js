const express=require("express");
const { isAuthenticated } = require("../middleware/auth");
const { accessChat, createGroupChat, renameGroup, addToGC, removeFromGC, getConnChats } = require("../controller/chatController");
const router=express.Router();

router.route("/accessChat").post(isAuthenticated, accessChat);
router.route("/createGC").post(isAuthenticated, createGroupChat);
router.route("/renameGC").put(isAuthenticated, renameGroup);
router.route("/addtoGC").put(isAuthenticated, addToGC);
router.route("/removefromGC").delete(isAuthenticated, removeFromGC);
router.route("/connectedChats").get(isAuthenticated, getConnChats)
module.exports=router;