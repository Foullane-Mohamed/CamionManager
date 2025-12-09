import Joi from "joi";

export const validateTrip = (data) => {
  const schema = Joi.object({
    assignedTruck: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Assigned truck must be a valid MongoDB ObjectId",
        "any.required": "Assigned truck is required",
      }),
    assignedTrailer: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .optional()
      .messages({
        "string.pattern.base":
          "Assigned trailer must be a valid MongoDB ObjectId",
      }),
    assignedDriver: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Assigned driver must be a valid MongoDB ObjectId",
        "any.required": "Assigned driver is required",
      }),
    startPoint: Joi.string().trim().min(2).max(200).required().messages({
      "string.base": "Start point must be a string",
      "string.min": "Start point must be at least 2 characters",
      "string.max": "Start point cannot exceed 200 characters",
      "any.required": "Start point is required",
    }),
    destinationPoint: Joi.string().trim().min(2).max(200).required().messages({
      "string.base": "Destination point must be a string",
      "string.min": "Destination point must be at least 2 characters",
      "string.max": "Destination point cannot exceed 200 characters",
      "any.required": "Destination point is required",
    }),
    departureDate: Joi.date().required().messages({
      "date.base": "Departure date must be a valid date",
      "any.required": "Departure date is required",
    }),
    expectedArrivalDate: Joi.date()
      .greater(Joi.ref("departureDate"))
      .required()
      .messages({
        "date.base": "Expected arrival date must be a valid date",
        "date.greater": "Expected arrival date must be after departure date",
        "any.required": "Expected arrival date is required",
      }),
    status: Joi.string()
      .valid("À faire", "En cours", "Terminé")
      .optional()
      .messages({
        "any.only": "Status must be one of: À faire, En cours, Terminé",
      }),
    mileageAtDeparture: Joi.number().min(0).required().messages({
      "number.base": "Mileage at departure must be a number",
      "number.min": "Mileage at departure cannot be negative",
      "any.required": "Mileage at departure is required",
    }),
    mileageAtArrival: Joi.number().min(0).optional().messages({
      "number.base": "Mileage at arrival must be a number",
      "number.min": "Mileage at arrival cannot be negative",
    }),
    driverRemarks: Joi.string().trim().max(1000).optional().messages({
      "string.max": "Driver remarks cannot exceed 1000 characters",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateTripUpdate = (data) => {
  const schema = Joi.object({
    assignedTruck: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        "string.pattern.base":
          "Assigned truck must be a valid MongoDB ObjectId",
      }),
    assignedTrailer: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .optional()
      .messages({
        "string.pattern.base":
          "Assigned trailer must be a valid MongoDB ObjectId",
      }),
    assignedDriver: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        "string.pattern.base":
          "Assigned driver must be a valid MongoDB ObjectId",
      }),
    startPoint: Joi.string().trim().min(2).max(200).optional().messages({
      "string.min": "Start point must be at least 2 characters",
      "string.max": "Start point cannot exceed 200 characters",
    }),
    destinationPoint: Joi.string().trim().min(2).max(200).optional().messages({
      "string.min": "Destination point must be at least 2 characters",
      "string.max": "Destination point cannot exceed 200 characters",
    }),
    departureDate: Joi.date().optional().messages({
      "date.base": "Departure date must be a valid date",
    }),
    expectedArrivalDate: Joi.date().optional().messages({
      "date.base": "Expected arrival date must be a valid date",
    }),
    actualArrivalDate: Joi.date().optional().messages({
      "date.base": "Actual arrival date must be a valid date",
    }),
    status: Joi.string()
      .valid("À faire", "En cours", "Terminé")
      .optional()
      .messages({
        "any.only": "Status must be one of: À faire, En cours, Terminé",
      }),
    mileageAtDeparture: Joi.number().min(0).optional().messages({
      "number.base": "Mileage at departure must be a number",
      "number.min": "Mileage at departure cannot be negative",
    }),
    mileageAtArrival: Joi.number().min(0).optional().messages({
      "number.base": "Mileage at arrival must be a number",
      "number.min": "Mileage at arrival cannot be negative",
    }),
    driverRemarks: Joi.string().trim().max(1000).optional().messages({
      "string.max": "Driver remarks cannot exceed 1000 characters",
    }),
  }).min(1);

  return schema.validate(data, { abortEarly: false });
};

export const validateStatusUpdate = (data) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("À faire", "En cours", "Terminé")
      .required()
      .messages({
        "any.only": "Status must be one of: À faire, En cours, Terminé",
        "any.required": "Status is required",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};
