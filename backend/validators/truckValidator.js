import Joi from "joi";

export const validateTruck = (data) => {
  const currentYear = new Date().getFullYear();

  const schema = Joi.object({
    matricule: Joi.string().trim().uppercase().required().messages({
      "string.empty": "Truck number (matricule) is required",
      "any.required": "Truck number (matricule) is required",
    }),
    brand: Joi.string().trim().min(2).required().messages({
      "string.empty": "Brand is required",
      "string.min": "Brand must be at least 2 characters long",
      "any.required": "Brand is required",
    }),
    model: Joi.string().trim().min(1).required().messages({
      "string.empty": "Model is required",
      "any.required": "Model is required",
    }),
    yearOfManufacture: Joi.number()
      .integer()
      .min(1900)
      .max(currentYear + 1)
      .required()
      .messages({
        "number.base": "Year of manufacture must be a number",
        "number.min": "Year must be after 1900",
        "number.max": "Year cannot be in the future",
        "any.required": "Year of manufacture is required",
      }),
    status: Joi.string()
      .valid("Disponible", "En Mission", "En Maintenance")
      .default("Disponible")
      .messages({
        "any.only": "Status must be: Disponible, En Mission, or En Maintenance",
      }),
    currentMileage: Joi.number().min(0).required().messages({
      "number.base": "Current mileage must be a number",
      "number.min": "Mileage cannot be negative",
      "any.required": "Current mileage is required",
    }),
    fuelType: Joi.string()
      .valid("Diesel", "Gasoline", "Other")
      .required()
      .messages({
        "any.only": "Fuel type must be: Diesel, Gasoline, or Other",
        "any.required": "Fuel type is required",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateTruckUpdate = (data) => {
  const currentYear = new Date().getFullYear();

  const schema = Joi.object({
    matricule: Joi.string().trim().uppercase(),
    brand: Joi.string().trim().min(2),
    model: Joi.string().trim().min(1),
    yearOfManufacture: Joi.number()
      .integer()
      .min(1900)
      .max(currentYear + 1),
    status: Joi.string().valid("Disponible", "En Mission", "En Maintenance"),
    currentMileage: Joi.number().min(0),
    fuelType: Joi.string().valid("Diesel", "Gasoline", "Other"),
  }).min(1); // At least one field must be provided for update

  return schema.validate(data, { abortEarly: false });
};

export const validateStatusUpdate = (data) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("Disponible", "En Mission", "En Maintenance")
      .required()
      .messages({
        "any.only": "Status must be: Disponible, En Mission, or En Maintenance",
        "any.required": "Status is required",
      }),
  });

  return schema.validate(data);
};
