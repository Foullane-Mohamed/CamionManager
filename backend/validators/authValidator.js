import Joi from "joi";

export const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required(),
    nationalId: Joi.string().min(5).required(),
    licenseNumber: Joi.string().min(5).required(),
    licenseType: Joi.string().valid("B", "C", "D", "EC").required(),
    address: Joi.string().min(10).required(),
    dateOfBirth: Joi.date().max("now").required(),
  });

  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

export const validateApproval = (data) => {
  const schema = Joi.object({
    accountStatus: Joi.string().valid("approved", "rejected").required(),
  });
  return schema.validate(data);
};

export const validateAdminCreation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
