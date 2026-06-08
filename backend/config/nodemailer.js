import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpPort = Number(process.env.SMTP_PORT) || (smtpSecure ? 465 : 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 5000,
  socketTimeout: 5000,
  requireTLS: process.env.SMTP_REQUIRE_TLS === "true",
  tls: {
    rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false",
  },
  logger: process.env.SMTP_DEBUG === "true",
  debug: process.env.SMTP_DEBUG === "true",
});

// Verify SMTP connection at startup
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP connection FAILED:", error.message);
    console.error("SMTP_HOST:", process.env.SMTP_HOST);
    console.error("SMTP_PORT:", process.env.SMTP_PORT);
    console.error("SMTP_SECURE:", process.env.SMTP_SECURE);
    console.error("SMTP_USER:", process.env.SMTP_USER);
    console.error("SMTP_PASS set?:", !!process.env.SMTP_PASS);
  } else {
    console.log("✅ SMTP connection verified — emails will be sent.");
  }
});

export default transporter;