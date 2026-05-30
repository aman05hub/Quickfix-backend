const axios = require("axios");

async function sendOtpEmail(toEmail, otp) {
    const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: { name: "QuickFix", email: "noreply.quickfix.update@gmail.com" },
            to: [{ email: toEmail }],
            subject: "QuickFix OTP Verification",
            htmlContent: `
                <div style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;">
                    <div style="max-width:500px;margin:auto;background:white;padding:30px;border-radius:12px;text-align:center;">
                        <h2 style="color:#4f46e5;">QuickFix ⚡</h2>
                        <p style="color:#666;">Use the OTP below to complete your registration:</p>
                        <div style="font-size:36px;font-weight:bold;color:#4f46e5;letter-spacing:10px;margin:25px 0;">
                            ${otp}
                        </div>
                        <p style="color:#999;">Valid for 5 minutes ⏱️</p>
                        <p style="font-size:12px;color:#aaa;">If you did not request this, ignore this email.</p>
                    </div>
                </div>
            `
        },
        {
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "Content-Type": "application/json"
            }
        }
    );
    return response.data;
}

module.exports = { sendOtpEmail };