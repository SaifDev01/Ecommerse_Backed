const express = require("express")
const { registerUser, loginUser, logoutUser, updateUser, getAllUsers, imageUpload, getUser, deleteImage, deleteUser, test, getLogs, forgotPassword, resetPassword } = require("../controllers/userController")
const { isAuthenticated } = require("../middleWare/auth")
const router  = express.Router()
const upload  = require("../middleWare/upload")

router.route("/deleteImage").delete(isAuthenticated,deleteImage)
router.route("/uploadImage").post(isAuthenticated,upload.single("userImage"),imageUpload)
router.route("/allUsers").get(isAuthenticated,getAllUsers)
router.route("/register").post(upload.single("userImage"),registerUser)
router.route("/login").post(loginUser)
router.route("/pass/forget").post(forgotPassword)
router.route("/password/reset/:token").get(resetPassword)
router.route("/logout").get(isAuthenticated,logoutUser)
router.route("/user/:id").patch(isAuthenticated, updateUser).delete(deleteUser)
router.route("/user").get(isAuthenticated,getUser)
router.route("/test").post(isAuthenticated,upload.single("userImage"),test)
router.route("/log/:id").get(getLogs)
module.exports = router