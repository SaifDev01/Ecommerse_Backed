const express = require("express")
const {addAddress} = require("../controllers/addressController")
const { isAuthenticated } = require("../middleWare/auth")
const router = express.Router()

router.route("/address").post(isAuthenticated,addAddress)


module.exports = router
 