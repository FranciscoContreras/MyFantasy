import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
