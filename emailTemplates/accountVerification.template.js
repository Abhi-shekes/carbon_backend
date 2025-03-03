import mailSender from "../mailSetup.js";
import dotenv from "dotenv";
dotenv.config();

// Send account verification email
export const accountVerificationEmail = async (email, hash) => {
  return mailSender(
    email,
    "Verify Your Account - Eco Footprint 🌍",
    `<div style="font-size:18px; font-family: Arial, sans-serif; color: #000;">
      <h2 style="color: #007B3D;">Welcome to Eco Footprint!</h2>
      <p>You're one step closer to tracking and reducing your carbon footprint! Please verify your email by clicking the button below:</p>
      <a href='${`${process.env.BACKEND_URL}/auth/verify/${hash}`}' style="text-decoration: none;">
        <button style="
          background-color: #007B3D; 
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
      <p style="color: #555;">Thank you for joining us in making a positive impact on the environment! 🌱</p>
    </div>`
  );
};

// Send password reset email
export const passwordResetEmail = async (email, hash) => {
  return mailSender(
    email,
    "Reset Your Password - Eco Footprint 🌱",
    `<div style="font-size:18px; font-family: Arial, sans-serif; color: #000;">
      <h2 style="color: #007B3D;">Forgot Your Password?</h2>
      <p>Don't worry! Click the button below to reset your password and continue your journey towards a greener lifestyle:</p>
      <a href='${`${process.env.BACKEND_URL}/auth/reset/${hash}`}' style="text-decoration: none;">
        <button style="
          background-color: #007B3D; 
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
      <p style="color: #555;">If you didn’t request this, please ignore this email.</p>
    </div>`
  );
};
