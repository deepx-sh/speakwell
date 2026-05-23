import z, { email } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),

    email: z
      .string()
      .check(z.trim(), z.email("Invalid email address"), z.toLowerCase()),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain uppercase,lowercase,number, and speacial character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  })
  .transform((data) => {
    const { confirmPassword, ...rest } = data;
    return rest;
  });

export const loginSchema = z.object({
  email: z
    .string()
    .check(z.trim(), z.email("Invalid email address"), z.toLowerCase()),

  password: z.string().min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
  email: z
    .string()
        .check(z.trim(), z.email("Invalid email address"), z.toLowerCase()),
    
    otp: z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d{6}$/,"OTP must contain only numbers")
});


export const resendOtpSchema = z.object({
  
    email: z
      .string()
      .check(z.trim(), z.email("Invalid email address"), z.toLowerCase()),

  type: z.enum([
    "VERIFY_EMAIL",
  ], {
    error:"Invalid OTP type"
  })
})
export const forgotPasswordSchema=z.object({
    email: z
        .string()
        .check(z.trim(), z.email("Invalid email address"), z.toLowerCase()),
})

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .min(1, "Reset token is required"),
    
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain uppercase, lowercase, number and speacial characters"
    ),
    
    confirmPassword: z
      .string()
      .min(1,"Please confirm your password")
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password do not mathch",
    path:["confirmPassword"]
  }).transform((data)=>{
    const { confirmPassword, ...rest } = data;
    return rest;
  })