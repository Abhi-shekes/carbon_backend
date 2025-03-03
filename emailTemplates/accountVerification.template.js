import mailSender from "../mailSetup.js";
import dotenv from "dotenv";
dotenv.config();

// Send account verification email
export const accountVerificationEmail = async (email, hash) => {
  return mailSender(
    email,
    "Verify Your Account - E-Waste Locator ♻️",
    `<div style="font-size:18px; font-family: Arial, sans-serif; color: #000;">
      <h2 style="color: #000;">Welcome to E-Waste Locator!</h2>
      <p>To complete your registration, please verify your email by clicking the button below:</p>
      <a href='${`${process.env.BACKEND_URL}/auth/verify/${hash}`}' style="text-decoration: none;">
        <button style="
          background-color: #008000; 
          color: #fff; 
          font-family: Arial, sans-serif; 
          font-size: 16px; 
          padding: 12px 30px; 
          border: none; 
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-radius: 5px;
          display: inline-block;
          transition: background-color 0.3s ease;
        ">Verify Account</button>
      </a>
      <p style="color: #555;">This link is valid for a single use.</p>
      <p style="color: #555;">Thank you for joining us in making e-waste disposal easier and more responsible.</p>
    </div>`
  );
};

// Send password reset email
export const passwordResetEmail = async (email, hash) => {
  return mailSender(
    email,
    "Reset Your Password - E-Waste Locator ♻️",
    `<div style="font-size:18px; font-family: Arial, sans-serif; color: #000;">
      <h2 style="color: #000;">Forgot Your Password?</h2>
      <p>No worries! Click the button below to reset your password:</p>
      <a href='${`${process.env.BACKEND_URL}/auth/reset/${hash}`}' style="text-decoration: none;">
        <button style="
          background-color: #008000; 
          color: #fff; 
          font-family: Arial, sans-serif; 
          font-size: 16px; 
          padding: 12px 30px; 
          border: none; 
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-radius: 5px;
          display: inline-block;
          transition: background-color 0.3s ease;
        ">Reset Password</button>
      </a>
      <p style="color: #555;">This link is valid for one-time use only.</p>
      <p style="color: #555;">If you didn't request this, please ignore this email.</p>
    </div>`
  );
};
