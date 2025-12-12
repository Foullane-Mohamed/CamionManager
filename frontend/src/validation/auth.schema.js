import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  phoneNumber: z
    .string()
    .regex(
      /^[0-9]{10,15}$/,
      "Phone number must be 10-15 digits (numbers only)"
    ),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  nationalId: z
    .string()
    .min(5, "National ID must be at least 5 characters")
    .max(50),
  licenseNumber: z
    .string()
    .min(5, "License number must be at least 5 characters")
    .max(50),
  licenseType: z.enum(["B", "C", "D", "EC"], {
    errorMap: () => ({ message: "Please select a valid license type" }),
  }),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500),
  dateOfBirth: z
    .string()
    .regex(
      /^\d{2}\/\d{2}\/\d{4}$/,
      "Date of birth must be in format DD/MM/YYYY"
    )
    .refine((date) => {
      const [day, month, year] = date.split("/").map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 100;
    }, "Driver must be at least 18 years old"),
});
