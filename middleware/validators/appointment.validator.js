import Joi from "joi";
import mongoose from "mongoose";

const validateAppointment = (data) => {
  const schema = Joi.object({
    productName: Joi.string().min(2).max(100).required().messages({
      "string.empty": "Product name is required.",
    }),
    price: Joi.number().positive().required(),
    pickupDate: Joi.date().greater("now").required(),
    pickupTime: Joi.string().required(),
    address: Joi.string().required(),
    facilityAddress: Joi.string().required(),
    status: Joi.string()
      .valid("pending", "confirmed", "collected", "failed", "declined")
      .default("pending"),
    points: Joi.number().allow(null),
  });

  return schema.validate(data);
};

export default validateAppointment;
