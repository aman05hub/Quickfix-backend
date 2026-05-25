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

    tls: {
        rejectUnauthorized: false
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
    
});

module.exports = transporter;