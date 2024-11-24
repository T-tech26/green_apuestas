'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite/config";
import { cookies } from "next/headers";
import { registerParams } from "@/types/globals";
import { parseStringify } from "../utils";

const { APPWRITE_DATABASE_ID, APPWRITE_USERS_COLLECTION_ID, APPWRITE_ACTIVATION_COLLECTION_ID } = process.env;


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
        return "An unexpected error occurred";
    }
};


export const logOut = async () => {
    try {
        const { account } = await createSessionClient();
        
        (await cookies()).delete('appwrite-session');

        await account.deleteSession('current');
        
    } catch (error) {
        console.error("Error logging out user", error);
        if(error) {
            return 'Error logging out user';
        }
    }
};


export const getLoggedInUser = async (): Promise<object | string> => {
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

        console.log(userId)
        const userExist = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_USERS_COLLECTION_ID!, 
            [Query.equal('userId', userId)]
        )
        
        /* eslint-disable @typescript-eslint/no-explicit-any */
        if(!(userExist as any)?.documents.length) return 'User not found';
        /* eslint-enable @typescript-eslint/no-explicit-any */
        
        console.log(userExist)
        
        return parseStringify(userExist);
    } catch (error) {
        console.error(error);
    }
};


export const activateSubscription = async (userId: string, pin: string) => {

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
  