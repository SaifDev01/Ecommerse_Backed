const express = require("express")
const { createOrder, userOrder } = require("../controllers/orderController")
const { isAuthenticated } = require("../middleWare/auth")
const router = express.Router()
const upload = require("../middleWare/upload")

router.route("/newOrder").post(isAuthenticated,createOrder) 
router.route("/userOrder").get(isAuthenticated,userOrder)


module.exports = router