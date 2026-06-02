import dotenv from 'dotenv';
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // use STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify SMTP connection at startup — check Render logs for ✅ or ❌
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP connection FAILED:", error.message);
        console.error("   SMTP_HOST:", process.env.SMTP_HOST);
        console.error("   SMTP_USER:", process.env.SMTP_USER);
        console.error("   SMTP_PASS set?:", !!process.env.SMTP_PASS);
    } else {
        console.log("✅ SMTP connection verified — emails will be sent.");
    }
});

export default transporter;
