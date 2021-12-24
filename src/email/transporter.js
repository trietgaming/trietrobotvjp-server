import "dotenv/config";
import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.EMAIL_SMTP,
  port: process.env.EMAIL_SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default transporter;
