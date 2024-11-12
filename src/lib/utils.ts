import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const authFormSchema = (type: string) => z.object({
  // activation
  activation_pin: type === 'signin' ? z.string().optional() : type === 'register' ? z.string().optional() : type === 'contact' ? z.string().optional() : z.string().min(6).max(6),

  // for both sign in and registration
  username: type === 'activation' ? z.string().optional() : type === 'contact' ? z.string().optional() : z.string().min(4).max(6),

  password: type === 'activation' ? z.string().optional() : type === 'contact' ? z.string().optional() : z.string().min(8),

  // for registration and contact
  firstname: type === 'activation' ? z.string().optional() : type === 'signin' ? z.string().optional() : z.string().min(3).max(18),

  lastname: type === 'activation' ? z.string().optional() : type === 'signin' ? z.string().optional() : z.string().min(3).max(18),

  email: type === 'activation' ? z.string().optional() : type === 'signin' ? z.string().optional() : z.string().email(),

  phone: type === 'activation' ? z.string().optional() : type === 'signin' ? z.string().optional() : z.string().min(10).max(13),

  // for registration only
  dateOfBirth: type === 'activation' ? z.string().optional() : type === 'signin' ? z.string().optional() : type === 'contact' ? z.string().optional() : z.string().min(8).max(8),

  country: type === 'activation' ? z.string().optional() : type === 'signin' ? z.string().optional() : type === 'contact' ? z.string().optional() : z.string().max(12),

  state: type === 'activation' ? z.string().optional() : type === 'signin' ? z.string().optional() : type === 'contact' ? z.string().optional() : z.string().max(10),

  city: type === 'activation' ? z.string().optional() : type === 'signin' ? z.string().optional() : type === 'contact' ? z.string().optional() : z.string().max(15),

  // for contact only
  message: type === 'activation' ? z.string().optional() : type === 'signin' ? z.string().optional() : type === 'registration' ? z.string().optional() : z.string().min(50),
})