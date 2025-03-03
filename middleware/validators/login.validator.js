import Joi from "joi";

// Login validation schema (unchanged)
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "string.empty": "Email is required.",
  }),
  password: Joi.string().min(6).max(50).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters.",
    "string.max": "Password cannot exceed 50 characters.",
  }),
});

export default loginSchema;
