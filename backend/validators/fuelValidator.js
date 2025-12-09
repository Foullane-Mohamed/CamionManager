import Joi from "joi";

export const validateFuel = (data) => {
  const schema = Joi.object({
    quantity: Joi.number().min(0).required().messages({
      "number.base": "Quantity must be a number",
      "number.min": "Quantity cannot be negative",
      "any.required": "Quantity is required",
    }),
    pricePerLitre: Joi.number().min(0).required().messages({
      "number.base": "Price per litre must be a number",
      "number.min": "Price per litre cannot be negative",
      "any.required": "Price per litre is required",
    }),
    totalCost: Joi.number().min(0).optional().messages({
      "number.base": "Total cost must be a number",
      "number.min": "Total cost cannot be negative",
    }),
    fuelStationLocation: Joi.string()
      .trim()
      .min(2)
      .max(200)
      .required()
      .messages({
        "string.base": "Fuel station location must be a string",
        "string.min": "Fuel station location must be at least 2 characters",
        "string.max": "Fuel station location cannot exceed 200 characters",
        "any.required": "Fuel station location is required",
      }),
    dateOfOperation: Joi.date().required().messages({
      "date.base": "Date of operation must be a valid date",
      "any.required": "Date of operation is required",
    }),
    linkedTrip: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .optional()
      .messages({
        "string.pattern.base": "Linked trip must be a valid MongoDB ObjectId",
      }),
    linkedDriver: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Linked driver must be a valid MongoDB ObjectId",
        "any.required": "Linked driver is required",
      }),
    linkedVehicle: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Linked vehicle must be a valid MongoDB ObjectId",
        "any.required": "Linked vehicle is required",
      }),
    notes: Joi.string().trim().max(500).optional().messages({
      "string.max": "Notes cannot exceed 500 characters",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateFuelUpdate = (data) => {
  const schema = Joi.object({
    quantity: Joi.number().min(0).optional().messages({
      "number.base": "Quantity must be a number",
      "number.min": "Quantity cannot be negative",
    }),
    pricePerLitre: Joi.number().min(0).optional().messages({
      "number.base": "Price per litre must be a number",
      "number.min": "Price per litre cannot be negative",
    }),
    totalCost: Joi.number().min(0).optional().messages({
      "number.base": "Total cost must be a number",
      "number.min": "Total cost cannot be negative",
    }),
    fuelStationLocation: Joi.string()
      .trim()
      .min(2)
      .max(200)
      .optional()
      .messages({
        "string.min": "Fuel station location must be at least 2 characters",
        "string.max": "Fuel station location cannot exceed 200 characters",
      }),
    dateOfOperation: Joi.date().optional().messages({
      "date.base": "Date of operation must be a valid date",
    }),
    linkedTrip: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .optional()
      .messages({
        "string.pattern.base": "Linked trip must be a valid MongoDB ObjectId",
      }),
    linkedDriver: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        "string.pattern.base": "Linked driver must be a valid MongoDB ObjectId",
      }),
    linkedVehicle: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        "string.pattern.base":
          "Linked vehicle must be a valid MongoDB ObjectId",
      }),
    notes: Joi.string().trim().max(500).optional().messages({
      "string.max": "Notes cannot exceed 500 characters",
    }),
  }).min(1);

  return schema.validate(data, { abortEarly: false });
};
