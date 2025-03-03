import { validateContactForm } from "../middleware/validators/contact.validator.js";
import Contact from "../models/contact.model.js";
import mailSender from "../mailSetup.js";
import dotenv from "dotenv";

dotenv.config();

// Handle contact form submission
export const submitContactForm = async (req, res) => {
  const { error } = validateContactForm(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const { name, email, message } = req.body;

    // Save to database
    const contact = new Contact({ name, email, message });
    await contact.save();

    // Send email notification to self (admin)
    await mailSender(
      process.env.MAILUSER,
      "New Contact Form Submission",
      `<div style="font-family: Arial, sans-serif;">
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message}</p>
      </div>`
    );

    res.status(201).json({
      success: true,
      message: "Your message has been received. We will get back to you soon!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all contact form submissions (Admin only)
export const getAllContacts = async (req, res) => {
  try {
    if (req.user.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Contact form submissions retrieved successfully.",
      contacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
