import { Admin, AdminDataWithImage, Payment, PaymentMethods, Transaction, Transactions, UserData, UserDataWithImage, UsersAndImages, VerificationDocument, VerificationDocuments } from "@/types/globals"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const authFormSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters long with uppercase letter, and number" }),

  firstname: z.string().min(3, { message: "Firt name must be at least 3 characters" }),

  lastname: z.string().min(3, { message: "Last name must be at least 3 characters" }),

  email: z.string().email({ message: "Enter a valid email address" }),

  phone: z.string().min(10, { message: "Enter a valid phone number" }),

  dateOfBirth: z.string().date(),

  country: z.string().min(3),

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
export const paymentMethodsWithImages = (paymentMethods: Payment): PaymentMethods[] => {

  return (paymentMethods as Payment)?.method.map((method) => {

    const image = (paymentMethods as Payment)?.logo.find((img) => img.name === method.logo); // Match by the logo name

    return {
      ...method,
      logoUrl: image && `${process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID}/files/${image.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`,
    };
  })
};


// Map over the transactions and match logos to images
export const transactionsWithImages = (transactions: Transactions): Transaction[] => {

  return (transactions as Transactions)?.transactions.map((trans) => {

    const image = (transactions as Transactions)?.reciepts.find((img) => img.name === trans.reciept); // Match by the reciept name

    return {
      ...trans,
      recieptUrl: image ? `${process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_RECIEPT_LOGO_BUCKET_ID}/files/${image.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin` : '',
    };
  })
};


export const paymentFormSchema = z.object({
  amount: z.string().min(2, {message: 'Amount must be greater than minimum deposit'}),
  reciept: z.instanceof(File)
      .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than or equal to 5MB',
      })
      .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
      message: 'File must be PNG or JPEG',
      }),
});


/* eslint-disable @typescript-eslint/no-explicit-any */
export const isAdmin = (user: any): user is AdminDataWithImage => {
    if (user.admin === undefined) { return false };
    return user.admin.label !== undefined;
}


// Type guard to check if the object is of type UserData
export const isUserData = (user: any): user is UserDataWithImage => {
    if(user.user === undefined) { return false };
    return user.user.userId !== undefined;
}
/* eslint-enable @typescript-eslint/no-explicit-any */


export const generateDateString = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0'); // Adds leading zero for single-digit days
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so we add 1
    const year = today.getFullYear();
    const hour = today.getHours().toString().padStart(2, '0');
    const munites = today.getMinutes().toString().padStart(2, '0');
    const seconds = today.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year}, ${hour}:${munites}:${seconds}`;
}


export const formatAmount = (amount: string) => {

    if(amount !== undefined && amount.includes('.')) {
        // Split the amount into integer and decimal parts
        let [integerPart, decimalPart] = amount.split('.') 
    
        // Handle cases where there's no decimal part
        let formattedInteger = integerPart;
        
        // Handle integer part formatting
        if (formattedInteger.length === 4) {
            formattedInteger = formattedInteger[0] + ',' + formattedInteger.slice(1);
        } else if (formattedInteger.length === 5) {
            formattedInteger = formattedInteger.slice(0, 2) + ',' + formattedInteger.slice(2);
        } else if (formattedInteger.length >= 6) {
            formattedInteger = formattedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        if(decimalPart.length === 0) {
          decimalPart == '00';
        } else if(decimalPart.length === 1) {
          decimalPart += '0';
        }

        return `${formattedInteger}.${decimalPart}`;
    }

    if (amount !== undefined) {
        let formattedAmount = amount;
        if (formattedAmount.length === 4) {
            formattedAmount = formattedAmount[0] + ',' + formattedAmount.slice(1);
        } else if (formattedAmount.length === 5) {
            formattedAmount = formattedAmount.slice(0, 2) + ',' + formattedAmount.slice(2);
        } else if (formattedAmount.length >= 6) {
            formattedAmount = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        return `${formattedAmount}.00`;
    }

    return '0.00'; // Default case
};


// Map over the payment methods and match logos to images
export const verificationDocumentWithImages = (documents: VerificationDocuments): VerificationDocument[] => {

    return (documents as VerificationDocuments).documents.map((doc) => {

        const frontImage = (documents as VerificationDocuments).files.find((img) => img.name === doc.front); // Match by the logo name
        const backImage = (documents as VerificationDocuments).files.find((img) => img.name === doc.back); // Match by the logo name

        return {
            ...doc,
            frontUrl: frontImage && `${process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_VERIFICATION_DOCUMENT_BUCKET_ID}/files/${frontImage.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`,
            backUrl: backImage && `${process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_VERIFICATION_DOCUMENT_BUCKET_ID}/files/${backImage.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`,
        };
    })
};


// Map over the payment methods and match logos to images
export const loggedInUserWithImage = (user: UserDataWithImage): UserData => {
  
    const profileImage = user.image.name !== undefined ? user.image.name : '';


    return {
        ...user.user,
        profileImgUrl: profileImage !== '' ? `${process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID}/files/${user.image.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin` : profileImage,
    };
};


// Map over the payment methods and match logos to images
export const loggedInAdminWithImage = (user: AdminDataWithImage): Admin => {
  
    const image = user.image.name !== undefined ? user.image.name : '';


    return {
        ...user.admin,
        adminImg: image !== '' ? `${process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID}/files/${user.image.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin` : '',
    };
};


export const allUsersWithImages = (users: UsersAndImages): UserData[] => {

  return (users as UsersAndImages).users.map((user) => {

    const image = (users as UsersAndImages).images.find((img) => img.name === user.profileImg); // Match by the logo name

    return {
      ...user,
      profileImgUrl: image ? `${process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_URL}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID}/files/${image.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin` : '',
    };
  })
};
