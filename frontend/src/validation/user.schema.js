import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "chauffeur"]),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  nationalId: z.string().min(5).max(50).optional().or(z.literal("")),
  licenseNumber: z.string().min(5).max(50).optional().or(z.literal("")),
  licenseType: z.enum(["B", "C", "D", "EC"]).optional(),
  address: z.string().min(10).max(500).optional().or(z.literal("")),
});

export const approveUserSchema = z.object({
  accountStatus: z.enum(["approved", "rejected"]),
});
