import Appointment from "../models/appointment.model.js";
import Credential from "../models/credential.model.js";
import validateAppointment from "../middleware/validators/appointment.validator.js";
import mailSender from "../mailSetup.js";
import dotenv from "dotenv";

dotenv.config();

// Book Appointment
export const bookAppointment = async (req, res) => {
  const { error } = validateAppointment(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const {
      productName,
      price,
      pickupDate,
      pickupTime,
      address,
      facilityAddress,
    } = req.body;

    const newAppointment = new Appointment({
      user: req.user.id,
      productName,
      price,
      pickupDate,
      pickupTime,
      address,
      facilityAddress,
    });

    await newAppointment.save();

    // Send email to admin
    const adminEmail = process.env.MAILUSER;
    const mailSubject = "New E-Waste Collection Appointment 📅";
    const mailBody = `
        <div style="font-size:16px; font-family: Arial, sans-serif; color: #000;">
          <h3>New E-Waste Collection Request</h3>
          <p><b>Name:</b> ${req.user.name}</p>
          <p><b>Product:</b> ${productName}</p>
          <p><b>Estimated Price:</b> ₹${price}</p>
          <p><b>Pickup Date:</b> ${new Date(pickupDate).toDateString()}</p>
          <p><b>Pickup Time:</b> ${pickupTime}</p>
          <p><b>Pickup Address:</b> ${address}</p>
          <p><b>Facility Address:</b> ${facilityAddress}</p>
          <p>Please review and confirm the appointment.</p>
        </div>
      `;

    await mailSender(adminEmail, mailSubject, mailBody);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Appointment (Admin)
export const updateAppointment = async (req, res) => {
  try {
    if (req.user.type != "admin") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const { appointmentId } = req.params;
    const { status, points = null } = req.body;

    if (!appointmentId)
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID is required." });

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });

    if (status) {
      if (
        !["pending", "confirmed", "collected", "failed", "declined"].includes(
          status
        )
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status." });
      }
      appointment.status = status;
    }

    if (points !== null) {
      if (isNaN(Number(points)) || Number(points) < 0) {
        return res.status(400).json({
          success: false,
          message: "Points must be a positive number.",
        });
      }

      // Update user total points
      const user = await Credential.findById(appointment.user);
      if (user) {
        user.totalPoints =
          (user.totalPoints || 0) + (points - (appointment.points || 0));
        await user.save();
      }

      appointment.points = points;
    }

    await appointment.save();
    res.status(200).json({
      success: true,
      message: "Appointment updated successfully.",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Appointments for a Specific User
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.find({ user: userId }).sort({
      pickupDate: -1,
    });

    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully.",
      appointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a Specific Appointment by ID (For User or Admin)
export const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID is required." });
    }

    // Fetch appointment and populate user details from Credential collection
    const appointment = await Appointment.findById(appointmentId).populate(
      "user",
      "name email totalPoints"
    );

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    // Allow admin to access any appointment, but users can only access their own
    if (
      req.user.type !== "admin" &&
      appointment.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this appointment.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment fetched successfully.",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Fetch All Appointments
export const getAllAppointments = async (req, res) => {
  try {
    if (req.user.type !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access." });
    }

    // Fetch all appointments with user details (name, email, totalPoints)
    const appointments = await Appointment.find()
      .populate("user", "name email totalPoints")
      .sort({ pickupDate: -1 });

    res.status(200).json({
      success: true,
      message: "All appointments fetched successfully.",
      appointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
