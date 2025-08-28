import { z } from 'zod'

export const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers and underscores')

export const emailSchema = z.string().email().transform((v) => v.toLowerCase())

export const passwordSchema = z
  .string()
  .min(8)
  .regex(/[a-z]/, 'one lowercase')
  .regex(/[A-Z]/, 'one uppercase')
  .regex(/[0-9]/, 'one number')
  .regex(/[^A-Za-z0-9]/, 'one symbol')

export const signUpSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
})

export type SignUpSchema = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(1),
  remember: z.boolean().optional().default(false),
})

export type SignInSchema = z.infer<typeof signInSchema>
