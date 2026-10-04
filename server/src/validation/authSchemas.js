import { z } from "zod";

const email = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .max(254, "Email address is too long")
  .transform((value) => value.toLowerCase());

const password = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .max(128, "Password cannot exceed 128 characters");

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(60, "Name cannot exceed 60 characters"),

    email,

    password,
  })
  .strict();

export const loginSchema = z
  .object({
    email,

    password: z
      .string()
      .min(1, "Password is required")
      .max(128, "Password cannot exceed 128 characters"),
  })
  .strict();

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(60, "Name cannot exceed 60 characters")
      .optional(),

    targetRole: z
      .string()
      .trim()
      .min(2, "Target role is too short")
      .max(100, "Target role cannot exceed 100 characters")
      .optional(),

    experienceLevel: z
      .enum(["Beginner", "Intermediate", "Advanced"])
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile field is required",
  });

export const changePasswordSchema = z
  .object({
    currentPassword: password,
    newPassword: password,
  })
  .strict()
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from the current password",
  });
