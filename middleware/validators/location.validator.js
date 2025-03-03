import Joi from "joi";

export const validateLocation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.number().integer().required(),
    address: Joi.string().required(),
    installedCapacityMTA: Joi.number().integer().required(),
    contact: Joi.object({
      phone_no: Joi.string().required(),
      website: Joi.string().uri().required(),
    }).required(),
  });

  return schema.validate(data);
};
