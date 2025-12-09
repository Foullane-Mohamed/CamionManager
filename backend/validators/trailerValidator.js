import Joi from "joi";

export const validateTrailer = (data) => {
  const schema = Joi.object({
    matricule: Joi.string().trim().uppercase().required().messages({
      "string.empty": "Trailer number (matricule) is required",
      "any.required": "Trailer number (matricule) is required",
    }),
    type: Joi.string()
      .valid(
        "Frigo",
        "Plateau",
        "Fourgon",
        "Citerne",
        "Benne",
        "Porte-conteneur"
      )
      .required()
      .messages({
        "any.only":
          "Type must be: Frigo, Plateau, Fourgon, Citerne, Benne, or Porte-conteneur",
        "any.required": "Trailer type is required",
      }),
    maximumLoad: Joi.number().min(0).required().messages({
      "number.base": "Maximum load must be a number",
      "number.min": "Maximum load cannot be negative",
      "any.required": "Maximum load is required",
    }),
    status: Joi.string()
      .valid("Disponible", "En Mission", "En Maintenance")
      .default("Disponible")
      .messages({
        "any.only": "Status must be: Disponible, En Mission, or En Maintenance",
      }),
    currentMileage: Joi.number().min(0).messages({
      "number.base": "Current mileage must be a number",
      "number.min": "Mileage cannot be negative",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateTrailerUpdate = (data) => {
  const schema = Joi.object({
    matricule: Joi.string().trim().uppercase(),
    type: Joi.string().valid(
      "Frigo",
      "Plateau",
      "Fourgon",
      "Citerne",
      "Benne",
      "Porte-conteneur"
    ),
    maximumLoad: Joi.number().min(0),
    status: Joi.string().valid("Disponible", "En Mission", "En Maintenance"),
    currentMileage: Joi.number().min(0),
  }).min(1);

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
