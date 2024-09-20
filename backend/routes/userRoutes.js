const express=require("express");
const { registerUser, verifyEmail, loginUser, logoutUser, changePass, forgotPass, resetPassword, allUsers, loadUser, uploadImage } = require("../controller/userController");
const { isAuthenticated } = require("../middleware/auth");
const { uploadImageFile }=require("../middleware/upload")
const { addToGC, removeFromGC } = require("../controller/chatController");

const router=express.Router();

router.route("/register").post(uploadImageFile, registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(loginUser);
router.route("/logout").post(isAuthenticated, logoutUser);
router.route("/changePass").post(isAuthenticated, changePass);
router.route("/forgotPass").post(forgotPass)
router.route("/resetPass/:token").post(resetPassword)
router.route("/search").get(isAuthenticated, allUsers);
router.route("/me").get(isAuthenticated, loadUser);

module.exports=router;