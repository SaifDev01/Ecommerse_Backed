const app = require("./app")
const dotenv = require("dotenv")
const con = require("./config/db")
dotenv.config({path:"./backEnd/config/config.env"})

process.on("uncaughtException", (err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting Down");
    server.close(()=>{
        process.exit(1)
    })
})

con()


const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})
 
process.on("unhandledRejection" , err=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down");
    server.close(()=>{
        process.exit(1)
    })

})