import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASS,
  },
});

const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"E Waste Locator" <${process.env.MAILUSER}>`,
      to: to,
      subject: subject,
      text: "E Waste Locator",
      html: html,
    });

    if (info.accepted) {
      return "mailSent";
    } else {
      console.error(`Mail sending failed: ${JSON.stringify(info)}`);
      return "mailError";
    }
  } catch (error) {
    console.error(`Mail Error: ${error.message}`);
    return "mailError";
  }
};

export default sendMail;
