import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const authFormSchema = z.object({
  activation_pin: z.string().min(6).max(6, {
    message: 'Pin must be 6 digits'
  }),
  password: z.string().min(8),
})