const express = require("express")
const {  newScore, getAllScore, getScore, deleteScore, updateScore } = require("../controllers/scoreController")
const { isAuthenticated } = require("../middleWare/auth")
const router = express.Router()

router.route("/score/new").post(isAuthenticated,newScore)
router.route("/scores").get(isAuthenticated,getAllScore)
router.route("/score/:id").get(getScore).delete(isAuthenticated,deleteScore).patch(isAuthenticated,updateScore)

router.route("/addTeam").post(isAuthenticated,newScore)



module.exports = router