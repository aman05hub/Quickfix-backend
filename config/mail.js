const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    tls:{
        rejectUnauthorized: false
    }
    

});

 transporter.verify((err, success) => {
        if(err){
            console.log("Mail Error:", err);
        } else {
            console.log("Mail Server Ready");
        }
    });

module.exports = transporter;