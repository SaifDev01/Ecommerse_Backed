const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const errorMiddleware = require("./middleWare/error")
const product = require("./routes/productRoute")
const user = require("./routes/userRoute")
const score = require("./routes/scoreRoute")
const bodyParser = require("body-parser")
const order = require("./routes/orderRoute")
const address = require("./routes/addressRoute")
app.use(express.json())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use("/api/v1", product)
app.use("/api/v1", user)
app.use("/api/v1", score)
app.use("/api/v1",order)
app.use("/api/v1",address)
app.use(errorMiddleware)






module.exports = app; 