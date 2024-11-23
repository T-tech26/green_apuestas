import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const authFormSchema = z.object({
  username: z.string().max(8, { message: "Username must be less than 8 characters" }),

  password: z.string().min(8, { message: "Password must be at least 8 characters long with uppercase letter, and number" }),

  firstname: z.string().min(3).max(18, { message: "Firt name must be at least 3 characters" }),

  lastname: z.string().min(3).max(18, { message: "Last name must be at least 3 characters" }),

  email: z.string().email({ message: "Enter a valid email address" }),

  phone: z.string().min(10).max(13, { message: "Enter a valid phone number" }),

  dateOfBirth: z.string().date(),

  country: z.string().max(12),

  state: z.string().min(3),

  city: z.string().min(3),
})



export const contactFormSchema = z.object({
  firstname: z.string().min(3).max(18),

  lastname: z.string().min(3).max(18),

  email: z.string().email(),

  phone: z.string().min(10).max(13),

  message: z.string().min(50),
})



export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));
