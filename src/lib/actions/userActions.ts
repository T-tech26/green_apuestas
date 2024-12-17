'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite/config";
import { cookies } from "next/headers";
import { AmountAndReciept, Payment, PaymentMethod, PaymentMethods, registerParams, Transactions, UserData, UserGames } from "@/types/globals";
import { parseStringify } from "../utils";

const { 
    APPWRITE_DATABASE_ID, 
    APPWRITE_USERS_COLLECTION_ID, 
    APPWRITE_ACTIVATION_COLLECTION_ID,
    APPWRITE_PAYMENT_METHOD_COLLECTION_ID,
    APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID,
    APPWRITE_TRANSACTION_COLLECTION_ID,
    APPWRITE_PAYMENT_RECIEPT_LOGO_BUCKET_ID,
    APPWRITE_USER_BETS_COLLECTION_ID
 } = process.env;


export const register = async ({ password, ...data}: registerParams) => {

    const { firstname, lastname, email } = data;

    try {
        const { account, database } = await createAdminClient();

        const newUserAccount = await account.create(ID.unique(), email, password, `${firstname} ${lastname}`);

        if(!newUserAccount) return 'An unexpected error occured try again';

        const user = await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USERS_COLLECTION_ID!,
            ID.unique(),
            {
                ...data,
                userId: newUserAccount.$id
            }
        )

        const session = await account.createEmailPasswordSession(email, password);

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(user);

        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        /* eslint-enable @typescript-eslint/no-explicit-any */

        if(error?.code === 409) {
            return 'User already exists';
        }

        console.error("Error creating user", error);
    }
};


export const signin = async (email: string, password: string): Promise<string | object> => {
    try {
        const { account } = await createAdminClient();

        // Attempt to create a session using email and password
        const session = await account.createEmailPasswordSession(email, password);

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        // If login is successful, return the parsed session response
        return parseStringify(session);

        /* eslint-disable @typescript-eslint/no-explicit-any */ 
    } catch (error: any) {
        /* eslint-enable @typescript-eslint/no-explicit-any */

        // Handle specific error codes
        if (error.code === 401) {
            return "Invalid email or password";  // Invalid credentials
        }

        // Handle other errors, logging the details for debugging
        console.error("Login failed:", error);
        
        // Return a generic error message for unexpected issues
        return "An unexpected error occurred, check your connection and try again";
    }
};


export const logOut = async () => {
    try {
        const { account } = await createSessionClient();
        
        (await cookies()).delete('appwrite-session');

        await account.deleteSession('current');

        return 'success';
        
    } catch (error) {
        console.error("Error logging out user", error);
        if(error) {
            return 'Error logging out user';
        }
    }
};


export const getLoggedInUser = async (): Promise<UserData | string> => {
    try {
        const { account } = await createSessionClient(); 
        const { database } = await createAdminClient()
        const loggedInUser = await account.get();  // Get the logged-in user
        
        let id;

        /* eslint-disable @typescript-eslint/no-explicit-any */
        if((loggedInUser as any)?.$id) id = (loggedInUser as any)?.$id;
        /* eslint-enable @typescript-eslint/no-explicit-any */

        const user = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USERS_COLLECTION_ID!,
            [Query.equal('userId', id)]
        )
       
        return parseStringify(user.documents[0]);  // Assuming parseStringify formats the user object
    } catch (error) {
        console.error("Error getting logged in user", error);
        // Return specific error message for no session
        if (error instanceof Error && error.message.includes("No session")) {
            return "No user logged in";
        }

        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `Error: ${(error as any)?.message || "Unknown error"}`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
};
  

export const getUser = async (userId: string) => {
    try {
        const { database } = await createAdminClient();

        const userExist = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_USERS_COLLECTION_ID!, 
            [Query.equal('userId', userId)]
        )
        
        /* eslint-disable @typescript-eslint/no-explicit-any */
        if(!(userExist as any)?.documents.length) return 'User not found';
        /* eslint-enable @typescript-eslint/no-explicit-any */
        
        return parseStringify(userExist);
    } catch (error) {
        console.error(error);
    }
};


export const getAllUsers = async () => {
    try {
        const { database } = await createAdminClient();

        const allUsers = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_USERS_COLLECTION_ID!, 
        )
       
        return parseStringify(allUsers.documents);
    } catch (error) {
        console.error(error);
    }
};


export const activateSubscription = async (userId: string, pin: string): Promise<UserData | string> => {

    try {
        const { database } = await createAdminClient();

        const pinCheck = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_ACTIVATION_COLLECTION_ID!, 
            [Query.equal('code', pin)]
        )
        
        /* eslint-disable @typescript-eslint/no-explicit-any */
        if(!(pinCheck as any)?.documents.length) return 'Invalid code';
        /* eslint-enable @typescript-eslint/no-explicit-any */
        
        const updateSubscription = await database.updateDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USERS_COLLECTION_ID!,
            userId,
            { "subscription": true }
        )
        
        return parseStringify(updateSubscription);
    } catch (error) {
        console.error('Error enabling user subscription ', error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
};


export const updateUserProfile = async (field: string, data: string, id: string) => {
    try {
        const { database } = await createAdminClient();

        const updateProfile = await database.updateDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USERS_COLLECTION_ID!,
            id,
           { [field] : data }
        );

        // Return the updated profile
        return parseStringify(updateProfile);
    } catch (error) {
      console.error('Error enabling user subscription ', error);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      return `${(error as any)?.message}, try again`;
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }
};


export const generateActivationPin = async (pin: string) => {
    try {
        const { database } = await createAdminClient();

        const pinCheck = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_ACTIVATION_COLLECTION_ID!, 
            [Query.equal('code', pin)]
        );

        /* eslint-disable @typescript-eslint/no-explicit-any */
        if((pinCheck as any)?.documents.length) return 'Activation pin already exists, generate another pin';
        /* eslint-enable @typescript-eslint/no-explicit-any */

        const createPin = await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_ACTIVATION_COLLECTION_ID!,
            ID.unique(),
            {
                'code': pin
            }
        )

        return parseStringify(createPin);
    } catch (error) {
        console.error('Error creating activation code ', error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const getActivationPins = async () => {
    try {
        const { database } = await createAdminClient();

        const pins = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_ACTIVATION_COLLECTION_ID!, 
        );

        return parseStringify(pins.documents);
    } catch (error) {
        console.error('Error getting activation pins ', error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const deleteActivationPin = async (id: string) => {
    try {
        const { database } = await createAdminClient();

        await database.deleteDocument(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_ACTIVATION_COLLECTION_ID!,
            id
        );

        const pins = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_ACTIVATION_COLLECTION_ID!, 
        );

        return parseStringify(pins.documents);
    } catch (error) {
        console.error('Error deleting user: ', error);
    }
}


export const createPaymentMethod = async ({ logo, ...data }: PaymentMethod) => {

    try {
        const { database, storage } = await createAdminClient();

        await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_PAYMENT_METHOD_COLLECTION_ID!,
            ID.unique(),
            {
                ...data,
                logo: `${logo.name}`
            }
        )

        await storage.createFile(
            APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
            ID.unique(),
            logo
        )
    } catch (error) {
        console.error('Error creating payment method ', error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const getPaymentMethods = async (): Promise<Payment | string> => {
    try {
        const { database, storage } = await createAdminClient();

        const methods = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_PAYMENT_METHOD_COLLECTION_ID!,
        );

        const methodLogos = await storage.listFiles(
            APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!
        );

        return parseStringify({ method: methods.documents, logo: methodLogos.files });
    } catch (error) {
        console.error('Error creating payment method ', error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, refresh the page and try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const deletePaymentMethod = async (payment: PaymentMethods | string) => {
    try {
        const { database, storage } = await createAdminClient();

        const fileName = (payment as PaymentMethods)?.logo;

        const file = await storage.listFiles(
            APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
            [Query.equal('name', fileName ? fileName : '')]
        )

        const fileId = file.files[0].$id;
        
        await storage.deleteFile(
            APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
            fileId
        );

        const paymentId = (payment as PaymentMethods)?.$id;

        await database.deleteDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_PAYMENT_METHOD_COLLECTION_ID!,
            `${paymentId ? paymentId : ''}`
        );

        return 'Success'
    } catch (error) {
      console.error("Error deleting payment method ", error);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      return `${(error as any)?.message}, try again`;
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const createTransaction = async (
    { reciept, ...data }: AmountAndReciept, 
    method: PaymentMethods, 
    time: string, userId: string, type: string) => {

    try {
        const { database, storage } = await createAdminClient();


        await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_TRANSACTION_COLLECTION_ID!,
            ID.unique(),
            {
                transaction_type: type,
                transaction_method: method.type,
                transaction_status: 'pending',
                amount: data.amount,
                reciept: reciept.name,
                transaction_time: time,
                userId: userId,
                transaction_details: {
                    type: method.type,
                    payId: method.payId,
                    logoUrl: method.logoUrl,
                    minDeposit: method.minDeposit,
                    cryptoName: method.cryptoName,
                    address: method.address,
                    network: method.network,
                    bankName: method.bankName,
                    accountName: method.accountName,
                    accountNumber: method.accountNumber,
                    currency: method.currency,
                    rate: method.rate,
                    platformName: method.platformName,
                    email: method.email
                }
            }
        );

        await storage.createFile(
            APPWRITE_PAYMENT_RECIEPT_LOGO_BUCKET_ID!,
            ID.unique(),
            reciept
        );

        return 'Success';
    } catch (error) {
        console.error("Error creating transaction ", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}   


export const getTransactions = async (): Promise<Transactions | string> => {
    try {
        const { database, storage } = await createAdminClient();

        const transactions = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_TRANSACTION_COLLECTION_ID!,
        );

        const reciepts = await storage.listFiles(
            APPWRITE_PAYMENT_RECIEPT_LOGO_BUCKET_ID!
        )

        return parseStringify({ transactions: transactions.documents, reciepts: reciepts.files });
    } catch (error) {
        console.error("Error getting transactions ", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const depositStatus = async (id: string, status: string) => {
    try {
        const { database } = await createAdminClient();

        await database.updateDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_TRANSACTION_COLLECTION_ID!,
            id,
            { 'transaction_status': status }
        )

        return 'success';
    } catch (error) {
        console.error("Error setting payment status ", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const createGameTicket = async (data: UserGames) => {
    try {
        const { database } = await createAdminClient();

        await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USER_BETS_COLLECTION_ID!,
            ID.unique(),
            { ...data }
        )

        return 'success';
        
    } catch (error) {
        console.error("Error creating game ticket ", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}
  