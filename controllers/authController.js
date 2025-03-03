import loginValidator from "../middleware/validators/login.validator.js";
import signupValidator from "../middleware/validators/signup.validator.js";
import Credential from "../models/credential.model.js";
import Authentication from "../models/auth.model.js";
import { OAuth2Client } from "google-auth-library";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import getHash from "../helpers/hash.generator.js";
import dotenv from "dotenv";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Import email template
import {
  accountVerificationEmail,
  passwordResetEmail,
} from "../emailTemplates/accountVerification.template.js";
import welcomeEmail from "../emailTemplates/welcome.template.js";

dotenv.config();

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate the input
  const { error } = loginValidator.validate({ email, password });
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    // Find user by email
    const user = await Credential.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.type == "google-auth") {
      return res
        .status(401)
        .json({ success: false, message: "Kindly login using google" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Check if account is active
    if (!user.active) {
      return res
        .status(403)
        .json({ success: false, message: "Account is inactive" });
    }

    // Generate JWT
    const token = JWT.sign(
      { id: user._id, name: user.name, type: user.type, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use on HTTPS in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Respond with success
    res.status(200).json({
      success: true,
      type: user.type,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Google Login Controller
export const googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email } = payload;

    // Check if the user already exists
    let user = await Credential.findOne({ email });

    if (!user) {
      // If the user doesn't exist, create a new user
      user = new Credential({
        email,
        type: "google-auth",
        password: "svrkjdt ghli", // Dummy password for Google login
        active: true,
      });
      await user.save();
      await welcomeEmail(email);
    } else {
      if (user.type !== "google-auth") {
        return res
          .status(401)
          .json({ message: "Kindly login using email and password" });
      }
    }
    // Generate a JWT token for the user
    const token = JWT.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Respond with a success message
    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Google login error:", error);
    return res
      .status(500)
      .json({ message: "Error during Google login. Try again in some time" });
  }
};

export const signup = async (req, res) => {
  const { email, password, name, type = "user" } = req.body;

  // Validate the input
  const { error } = signupValidator.validate({ name, email, password });
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  if (type !== "user" && type !== "admin") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user type" });
  }

  try {
    // Check if the email already exists
    const existingUser = await Credential.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user credentials in database
    const newUser = await Credential.create({
      name,
      email,
      type,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate a unique verification hash
      let hash;
      while (true) {
        hash = getHash(`${email}${Date.now()}`);
        const checkUnique = await Authentication.findOne({ hash });
        if (!checkUnique) break;
      }

      // Save verification hash to authModel
      await Authentication.create({ email, hash, type: "activate" });

      // Respond with success message
      res.status(201).json({
        success: true,
        message: "Registration successful. Please verify your email.",
      });

      // Send verification email
      await accountVerificationEmail(email, hash);
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const hash = Number(req.params.hash);
  try {
    let auth = await Authentication.findOne({ hash }).lean();
    if (!auth) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired link" });
    }

    // Handling account activation/verification
    if (auth.type === "activate") {
      const activate = await Credential.updateOne(
        { email: auth.email },
        { active: true }
      );

      if (activate.modifiedCount === 1) {
        await Authentication.deleteOne({ email: auth.email });

        // send the welcome email
        await welcomeEmail(auth.email);

        return res.redirect(`${process.env.FRONTEND_URL}/login`);
      } else {
        console.error("Error updating account activation:", activate);
        return res
          .status(500)
          .json({ success: false, message: "Server error" });
      }
    }

    // Handling password reset
    if (auth.type === "password") {
      // Redirect to password reset frontend page
      return res.redirect(`${process.env.FRONTEND_URL}/reset-password/${hash}`);
    }

    // If the hash type is unexpected
    return res.status(401).json({ success: false, message: "Invalid request" });
  } catch (err) {
    console.error("Error at account verification:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    if (!req.cookies?.token) {
      return res
        .status(400)
        .json({ success: false, message: "No active session found" });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Controller to send link for reset requests
export const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists in the database
    const user = await Credential.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate a unique reset password hash
    let hash;
    while (true) {
      hash = getHash(`${email}${Date.now()}`);
      const checkUnique = await Authentication.findOne({ hash });
      if (!checkUnique) break;
    }

    // Save the hash to the Authentication model
    await Authentication.create({ email, hash, type: "password" });

    res.status(200).json({
      message: "Password reset link has been sent to your email.",
    });

    // Send the password reset email
    await passwordResetEmail(email, hash);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const updatePassword = async (req, res) => {
  const { hash, newPassword } = req.body;

  // Validate that the new password is not empty
  if (!newPassword) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  try {
    // Find the record by hash
    let auth = await Authentication.findOne({ hash }).lean();
    if (!auth) {
      return res.status(400).json({
        message: "Invalid or expired link",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the Credential collection
    const updateResult = await Credential.updateOne(
      { email: auth.email },
      { password: hashedPassword }
    );

    if (updateResult.modifiedCount === 1) {
      // Optionally delete the auth record after successful password update
      await Authentication.deleteOne({ email: auth.email });

      // Generate a new JWT with the updated credentials
      const token = JWT.sign(
        { id: updateResult._id, email: auth.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set the token in an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({
        message: "Password updated successfully",
      });
    } else {
      return res.status(500).json({
        message: "Error updating password",
      });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
