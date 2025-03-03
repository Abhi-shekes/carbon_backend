import mailSender from "../mailSetup.js";
import dotenv from "dotenv";
dotenv.config();

const welcomeEmail = async (email) => {
  return mailSender(
    email,
    "Welcome to Eco Footprint! 🌿",
    `<div style="font-size:16px; font-family: Arial, sans-serif; color: #000;">
        <h3 style="color: #007B3D; font-size: 20px;">Welcome to the Eco Footprint Community! 🌍</h3>
        <h4 style="color: #007B3D; font-size: 18px;">Track, Reduce, and Offset Your Carbon Footprint! 🌱</h4>
        <b style="font-size: 14px;">Your journey towards a greener lifestyle starts now! 🌿</b><br><br>
        
        Hi,<br>
        Welcome to <b>Eco Footprint</b> – your personal guide to tracking and reducing your carbon footprint! 🌍<br>
        Thank you for joining us in our mission to create a more sustainable planet. Your small actions can lead to big changes!<br><br>
        
        With Eco Footprint, you can:
        <ul>
          <li>📊 Track your carbon emissions.</li>
          <li>🌍 Learn how to live a more eco-friendly life.</li>
          <li>♻️ Discover sustainable habits and offset your footprint.</li>
        </ul>
        
        Ready to start your sustainability journey?<br><br>
        
        <a href='${process.env.FRONTEND_URL}' style="text-decoration: none;">
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
          ">Start Reducing Your Footprint</button>
        </a><br><br>

        <span style="color: #555; font-size: 13px;">Every action counts. Let's build a sustainable future together! 🌎</span><br>
        <b style="font-size: 14px;">Team Eco Footprint</b>
      </div>`
  );
};

export default welcomeEmail;
