const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const mailSender = async (email, title, body) => {
    try {
        // Create a transporter that uses Gmail's servers
        // This is the new, production-ready setup
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Use false for port 587
            auth: {
                user: process.env.MAIL_USER, // Your email from .env
                pass: process.env.MAIL_PASS, // Your Google App Password from .env
            },
        });

        // Send the email
        let info = await transporter.sendMail({
            from: `"CivicDesk" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body,
        });

        console.log("Real email sent successfully:", info.response);
        return info;

    } catch (error) {
        console.error("Error sending real email:", error);
        throw error;
    }
};

module.exports = mailSender;