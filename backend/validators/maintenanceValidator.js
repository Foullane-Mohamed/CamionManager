import Joi from "joi";

export const createMaintenanceRuleValidator = (data) => {
  const schema = Joi.object({
    maintenanceType: Joi.string()
      .valid("Tire Replacement", "Oil Change", "Vehicle Revision")
      .required()
      .messages({
        "any.only":
          "Maintenance type must be one of: Tire Replacement, Oil Change, Vehicle Revision",
        "any.required": "Maintenance type is required",
      }),
    mileageThreshold: Joi.number()
      .min(0)
      .when("maintenanceType", {
        is: Joi.string().valid("Oil Change", "Vehicle Revision"),
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        "number.min": "Mileage threshold must be a positive number",
        "any.required":
          "Mileage threshold is required for Oil Change and Vehicle Revision",
      }),
    timeThresholdDays: Joi.number()
      .min(0)
      .when("maintenanceType", {
        is: "Oil Change",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        "number.min": "Time threshold must be a positive number",
        "any.required": "Time threshold is required for Oil Change",
      }),
    description: Joi.string().trim().allow("").optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

// Validation for updating a maintenance rule (admin only)
export const updateMaintenanceRuleValidator = (data) => {
  const schema = Joi.object({
    maintenanceType: Joi.string()
      .valid("Tire Replacement", "Oil Change", "Vehicle Revision")
      .optional()
      .messages({
        "any.only":
          "Maintenance type must be one of: Tire Replacement, Oil Change, Vehicle Revision",
      }),
    mileageThreshold: Joi.number().min(0).optional().messages({
      "number.min": "Mileage threshold must be a positive number",
    }),
    timeThresholdDays: Joi.number().min(0).optional().messages({
      "number.min": "Time threshold must be a positive number",
    }),
    description: Joi.string().trim().allow("").optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

export const createMaintenanceValidator = (data) => {
  const schema = Joi.object({
    maintenanceType: Joi.string()
      .valid("Tire Replacement", "Oil Change", "Vehicle Revision", "Other")
      .required()
      .messages({
        "any.only":
          "Maintenance type must be one of: Tire Replacement, Oil Change, Vehicle Revision, Other",
        "any.required": "Maintenance type is required",
      }),
    linkedVehicle: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid vehicle ID format",
        "any.required": "Linked vehicle is required",
      }),
    linkedRule: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
      .allow(null)
      .messages({
        "string.pattern.base": "Invalid rule ID format",
      }),
    maintenanceDate: Joi.date().max("now").optional().messages({
      "date.max": "Maintenance date cannot be in the future",
    }),
    vehicleMileageAtMaintenance: Joi.number().min(0).required().messages({
      "number.min": "Vehicle mileage cannot be negative",
      "any.required": "Vehicle mileage at maintenance is required",
    }),
    nextMaintenanceDueDate: Joi.date()
      .min(Joi.ref("maintenanceDate"))
      .optional()
      .messages({
        "date.min": "Next maintenance due date must be after maintenance date",
      }),
    nextMaintenanceDueMileage: Joi.number()
      .min(Joi.ref("vehicleMileageAtMaintenance"))
      .optional()
      .messages({
        "number.min":
          "Next maintenance due mileage must be greater than current mileage",
      }),
    cost: Joi.number().min(0).required().messages({
      "number.min": "Cost cannot be negative",
      "any.required": "Maintenance cost is required",
    }),
    serviceProvider: Joi.string().trim().required().messages({
      "any.required": "Service provider is required",
    }),
    description: Joi.string().trim().allow("").optional(),
    partsReplaced: Joi.array()
      .items(
        Joi.object({
          partName: Joi.string().trim().required(),
          quantity: Joi.number().min(1).required(),
          unitPrice: Joi.number().min(0).required(),
        })
      )
      .optional(),
    status: Joi.string()
      .valid("Scheduled", "In Progress", "Completed", "Cancelled")
      .optional()
      .messages({
        "any.only":
          "Status must be one of: Scheduled, In Progress, Completed, Cancelled",
      }),
    remarks: Joi.string().trim().allow("").optional(),
  });

  return schema.validate(data);
};

// Validation for updating a maintenance record
export const updateMaintenanceValidator = (data) => {
  const schema = Joi.object({
    maintenanceType: Joi.string()
      .valid("Tire Replacement", "Oil Change", "Vehicle Revision", "Other")
      .optional()
      .messages({
        "any.only":
          "Maintenance type must be one of: Tire Replacement, Oil Change, Vehicle Revision, Other",
      }),
    linkedVehicle: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        "string.pattern.base": "Invalid vehicle ID format",
      }),
    linkedRule: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
      .allow(null)
      .messages({
        "string.pattern.base": "Invalid rule ID format",
      }),
    maintenanceDate: Joi.date().max("now").optional().messages({
      "date.max": "Maintenance date cannot be in the future",
    }),
    vehicleMileageAtMaintenance: Joi.number().min(0).optional().messages({
      "number.min": "Vehicle mileage cannot be negative",
    }),
    nextMaintenanceDueDate: Joi.date().optional(),
    nextMaintenanceDueMileage: Joi.number().min(0).optional().messages({
      "number.min": "Next maintenance due mileage cannot be negative",
    }),
    cost: Joi.number().min(0).optional().messages({
      "number.min": "Cost cannot be negative",
    }),
    serviceProvider: Joi.string().trim().optional(),
    description: Joi.string().trim().allow("").optional(),
    partsReplaced: Joi.array()
      .items(
        Joi.object({
          partName: Joi.string().trim().required(),
          quantity: Joi.number().min(1).required(),
          unitPrice: Joi.number().min(0).required(),
        })
      )
      .optional(),
    status: Joi.string()
      .valid("Scheduled", "In Progress", "Completed", "Cancelled")
      .optional()
      .messages({
        "any.only":
          "Status must be one of: Scheduled, In Progress, Completed, Cancelled",
      }),
    remarks: Joi.string().trim().allow("").optional(),
  }).min(1);

  return schema.validate(data);
};

// Validation for updating maintenance status
export const updateMaintenanceStatusValidator = (data) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("Scheduled", "In Progress", "Completed", "Cancelled")
      .required()
      .messages({
        "any.only":
          "Status must be one of: Scheduled, In Progress, Completed, Cancelled",
        "any.required": "Status is required",
      }),
  });

  return schema.validate(data);
};
