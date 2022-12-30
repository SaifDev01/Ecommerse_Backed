const { text } = require("body-parser")
const nodeMailer = require("nodemailer")


const sendEmail = async (options)=>{
    let transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port : 465,
        secure:true,
        // logger : true,
        // debugger: true,
        service : process.env.SMPT_SERVICE,
        auth:{
            user: process.env.SMPT_MAIL,
            pass : process.env.SMPT_PASS
        }
    }) 
    const mailOptions = {
        from : process.env.SMPT_MAIL, 
        to : options.email,
        subject : options.subject,
        text : options.message,
        html : options.html
    }
     
    await transporter.sendMail(mailOptions)
    
}

module.exports = sendEmail 