import mailSender from "../mailSetup.js";
import dotenv from "dotenv";
dotenv.config();

const welcomeEmail = async (email) => {
  return mailSender(
    email,
    "Welcome to E-Waste Locator! 🌍",
    `<div style="font-size:16px; font-family: Arial, sans-serif; color: #000;">
        <h3 style="color: #000; font-size: 20px;">Welcome to the E-Waste Locator Community!</h3>
        <h4 style="color: #000; font-size: 18px;">Let’s Make a Greener Future! 🌱</h4>
        <b style="font-size: 14px;">Your Journey Towards Responsible E-Waste Disposal Starts Now!♻️</b><br>
        Hi,<br>
        Welcome to <b>E-Waste Locator</b> - your one-stop solution for finding responsible and certified e-waste disposal centers near you! 🌍<br>
        Thank you for joining us in our mission to reduce electronic waste and promote a sustainable future. Every small step counts, and your participation makes a difference.<br>
        Get started now by locating the nearest e-waste drop-off point and contributing to a cleaner environment.<br>
        Whether you have old gadgets, broken appliances, or outdated tech, we’ll help you dispose of them responsibly.<br>
        Ready to take the first step towards a sustainable future?<br><br>
        
        <a href='${process.env.FRONTEND_URL}' style="text-decoration: none;">
          <button style="
            background-color: #008000; 
            color: #fff; 
            font-family: Georgia, serif; 
            font-size: 16px; 
            padding: 12px 30px; 
            border: none; 
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-radius: 5px;
            display: inline-block;
            transition: background-color 0.3s ease;
          ">Find E-Waste Centers</button>
        </a><br><br>

        <span style="color: #555; font-size: 13px;">Recycle Smart, Protect the Planet.</span><br>
        <span style="color: #555; font-size: 13px;">Together for a greener world,</span><br>
        <b style="font-size: 14px;">Team E-Waste Locator</b>
      </div>`
  );
};

export default welcomeEmail;
