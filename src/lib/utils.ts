import { Payment, PaymentMethods } from "@/types/globals"
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


/* eslint-disable @typescript-eslint/no-explicit-any */
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));
/* eslint-enable @typescript-eslint/no-explicit-any */


export const firstNameSchema = z.object({
  firstname: z.string().min(3),
})


export const lastNameSchema = z.object({
  lastname: z.string().min(3),
})


export const emailSchema = z.object({
  email: z.string().email(),
})

export const phoneNumberSchema = z.object({
  phone: z.string().min(3),
})

export const dateOfBirthSchema = z.object({
  dateOfBirth: z.string().date(),
})

export const countrySchema = z.object({
  country: z.string().min(3),
})

export const stateSchema = z.object({
  state: z.string().min(3),
})

export const citySchema = z.object({
  city: z.string().min(3),
})



// Map over the payment methods and match logos to images
export const paymentMethodsWithImages = (paymentMethods: Payment | string): PaymentMethods[] => {

  return (paymentMethods as Payment)?.method.map((method) => {

    const image = (paymentMethods as Payment)?.logo.find((img) => img.name === method.logo); // Match by the logo name

    return {
      ...method,
      logoUrl: image && `${process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID}/files/${image.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`,
    };
  })
};