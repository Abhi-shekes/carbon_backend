import Joi from "joi";

export const validateContactForm = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    message: Joi.string().min(10).max(1000).required(),
  });

  return schema.validate(data);
};
