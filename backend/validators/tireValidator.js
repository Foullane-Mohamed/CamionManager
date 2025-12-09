import Joi from "joi";

export const validateTire = (data) => {
  const schema = Joi.object({
    serialNumber: Joi.string().trim().uppercase().required().messages({
      "string.empty": "Serial number is required",
      "any.required": "Serial number is required",
    }),
    brand: Joi.string().trim().min(2).required().messages({
      "string.empty": "Brand is required",
      "string.min": "Brand must be at least 2 characters long",
      "any.required": "Brand is required",
    }),
    size: Joi.string().trim().required().messages({
      "string.empty": "Size is required",
      "any.required": "Size is required",
    }),
    status: Joi.string()
      .valid("Bon", "À remplacer", "Usé")
      .default("Bon")
      .messages({
        "any.only": "Status must be: Bon, À remplacer, or Usé",
      }),
    installationDate: Joi.date().max("now").required().messages({
      "date.base": "Installation date must be a valid date",
      "date.max": "Installation date cannot be in the future",
      "any.required": "Installation date is required",
    }),
    vehiclePosition: Joi.string()
      .valid(
        "Front Left",
        "Front Right",
        "Rear Left",
        "Rear Right",
        "Spare",
        "Trailer Front Left",
        "Trailer Front Right",
        "Trailer Rear Left",
        "Trailer Rear Right"
      )
      .required()
      .messages({
        "any.only":
          "Vehicle position must be valid (Front Left, Front Right, Rear Left, Rear Right, Spare, or Trailer positions)",
        "any.required": "Vehicle position is required",
      }),
    associatedVehicleType: Joi.string()
      .valid("Truck", "Trailer")
      .required()
      .messages({
        "any.only": "Associated vehicle type must be: Truck or Trailer",
        "any.required": "Associated vehicle type is required",
      }),
    associatedVehicleId: Joi.string().required().messages({
      "string.empty": "Associated vehicle ID is required",
      "any.required": "Associated vehicle ID is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateTireUpdate = (data) => {
  const schema = Joi.object({
    serialNumber: Joi.string().trim().uppercase(),
    brand: Joi.string().trim().min(2),
    size: Joi.string().trim(),
    status: Joi.string().valid("Bon", "À remplacer", "Usé"),
    installationDate: Joi.date().max("now"),
    vehiclePosition: Joi.string().valid(
      "Front Left",
      "Front Right",
      "Rear Left",
      "Rear Right",
      "Spare",
      "Trailer Front Left",
      "Trailer Front Right",
      "Trailer Rear Left",
      "Trailer Rear Right"
    ),
    associatedVehicleType: Joi.string().valid("Truck", "Trailer"),
    associatedVehicleId: Joi.string(),
  }).min(1);

  return schema.validate(data, { abortEarly: false });
};

export const validateStatusUpdate = (data) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("Bon", "À remplacer", "Usé")
      .required()
      .messages({
        "any.only": "Status must be: Bon, À remplacer, or Usé",
        "any.required": "Status is required",
      }),
  });

  return schema.validate(data);
};
