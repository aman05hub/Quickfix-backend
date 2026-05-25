const nodemailer = require("nodemailer");
const Brevo = require("@getbrevo/brevo");
require("dotenv").config();

// const transporter = nodemailer.createTransport({

//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,

//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     },

//     tls: {
//         rejectUnauthorized: false
//     },

//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 10000
    
// });

// module.exports = transporter;

const client = Brevo.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const transactionalEmailsApi = new Brevo.TransactionalEmailsApi();

module.exports = transactionalEmailsApi;