'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite/config";
import { cookies } from "next/headers";
import { Admin, AdminDataWithImage, BankDetails, ContactEmailType, LoggedInUser, Payment, PaymentMethod, PaymentMethods, registerParams, Transactions, UploadDocument, UserData, UserDataWithImage, UserGame, VerificationDocuments } from "@/types/globals";
import { formatAmount, parseStringify } from "../utils";
import { transporter } from "../email/email";
import * as handlebars from 'handlebars'
import { WelcomeEmailTemplate, WithdrawalEmailTemplate, approvedVerificationEmailTemplate, rejectedVerificationEmailTemplate, contactEmailTemplate } from "../email/template";
import ZeroBounceSDK from '@zerobounce/zero-bounce-sdk';

const { 
    APPWRITE_DATABASE_ID, 
    APPWRITE_USERS_COLLECTION_ID, 
    APPWRITE_ACTIVATION_COLLECTION_ID,
    APPWRITE_USED_CODE_COLLECTION_ID,
    APPWRITE_PAYMENT_METHOD_COLLECTION_ID,
    APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID,
    APPWRITE_TRANSACTION_COLLECTION_ID,
    APPWRITE_PAYMENT_RECIEPT_LOGO_BUCKET_ID,
    APPWRITE_USER_BETS_COLLECTION_ID,
    APPWRITE_USER_NOTIFICATION_COLLECTION_ID,
    APPWRITE_ADMIN_NOTIFICATION_COLLECTION_ID,
    APPWRITE_BANK_DETAILS_COLLECTION_ID,
    APPWRITE_VERIFICATION_DOCUMENT_BUCKET_ID,
    APPWRITE_VERIFICATION_DOCUMENT_COLLECTION_ID,
    APPWRITE_ADMIN_PROFILE_IMAGE_COLLECTION_ID,
    APPWRITE_GAMES_COLLECTION_ID,
    ZEROBOUNCE_API_KEY
 } = process.env;


const zeroBounce = new ZeroBounceSDK();
zeroBounce.init(ZEROBOUNCE_API_KEY!);


export const register = async ({ password, ...data}: registerParams) => {

    const { firstname, lastname, email } = data;
    const template = handlebars.compile(WelcomeEmailTemplate);

    try {
        const { account, database } = await createAdminClient();

        const response = await zeroBounce.validateEmail(email);

        if(response.status === 'invalid') { return 'Email is not valid, please try a valid email address'; }

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


        const emailBody = template({
            name: `${firstname} ${lastname}`,
        })


        const mailOptions = {
            from: 'Green apuestas <no-reply@greenapuestas.com>',
            to: email,
            subject: 'Welcome To Green Apuestas',
            text: emailBody,
            html: emailBody
        };

        await transporter.sendMail(mailOptions);

        return parseStringify(user);

    } catch (error) {
        console.error("Error creating user", error);
        return 'Something went wrong';
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


export const getLoggedInUser = async (): Promise<UserDataWithImage | AdminDataWithImage | string> => {
    try {
        const { account } = await createSessionClient(); 
        const { database, storage } = await createAdminClient()
        const loggedInUser = await account.get();  // Get the logged-in user


        if(loggedInUser && (loggedInUser as LoggedInUser)?.labels[0] === 'admin') {

            const adminProfileImg = await database.listDocuments(
                APPWRITE_DATABASE_ID!,
                APPWRITE_ADMIN_PROFILE_IMAGE_COLLECTION_ID!,
            )

            if(adminProfileImg.documents.length > 0) {
                
                const image = await storage.listFiles(
                    APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
                    [Query.equal('name', adminProfileImg.documents[0].fileName)]
                )

                const isAdmin: Admin = {
                    $id: loggedInUser.$id,
                    name: loggedInUser.name,
                    label: loggedInUser.labels,
                };

                return parseStringify({ admin: isAdmin, image: image.files[0] });
            }

            const isAdmin: Admin = {
                $id: loggedInUser.$id,
                name: loggedInUser.name,
                label: loggedInUser.labels,
            };

            return parseStringify({ admin: isAdmin, image: {} });
        }


        const user = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USERS_COLLECTION_ID!,
            [Query.equal('userId', loggedInUser.$id)]
        )

        if(user.documents[0].profileImg !== null) {
            const image = await storage.listFiles(
                APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
                [Query.equal('name', user.documents[0].profileImg)]
            )

            if(image.files.length > 0) {
                return parseStringify({ user: user.documents[0], image: image.files[0] });  // Assuming parseStringify formats the user object
            }
        }



        return parseStringify({ user: user.documents[0], image: {} });  // Assuming parseStringify formats the user object
    } catch (error) {
        console.error("Error getting logged in user", error);
        
        return 'No session';
    }
};


export const getAllUsers = async () => {
    try {
        const { database, storage } = await createAdminClient();

        const allUsers = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_USERS_COLLECTION_ID!, 
        );

        const profileImages = await storage.listFiles(
            APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
        );
       
        return parseStringify({ users: allUsers.documents, images: profileImages.files });
    } catch (error) {
        console.error(error);
    }
};


export const activateSubscription = async (userId: string, pin: string, type: string): Promise<UserData | string> => {

    try {
        const { database } = await createAdminClient();

        const pinCheck = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_ACTIVATION_COLLECTION_ID!, 
            [Query.equal('code', pin)]
        )
        
        /* eslint-disable @typescript-eslint/no-explicit-any */
        if(!(pinCheck as any)?.documents.length) return 'Invalid pin';
        /* eslint-enable @typescript-eslint/no-explicit-any */

        const usedPin = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_USED_CODE_COLLECTION_ID!, 
            [Query.equal('code', pin)]
        )

        /* eslint-disable @typescript-eslint/no-explicit-any */
        if((usedPin as any)?.documents.length) return 'Pin already used';
        /* eslint-enable @typescript-eslint/no-explicit-any */


        await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USED_CODE_COLLECTION_ID!,
            ID.unique(),
            {
                'code': pin
            }
        )


        if(type === 'allow verification') {
            const updateAllowVerification = await database.updateDocument(
                APPWRITE_DATABASE_ID!,
                APPWRITE_USERS_COLLECTION_ID!,
                userId,
                { "allowVerification": true }
            )

            return parseStringify(updateAllowVerification);
        }


        if(type === 'charges') {
            const updateAllowVerification = await database.updateDocument(
                APPWRITE_DATABASE_ID!,
                APPWRITE_USERS_COLLECTION_ID!,
                userId,
                { "chargesPaid": true }
            )

            return parseStringify(updateAllowVerification);
        }


        if(type === 'premium card') {
            const updateAllowVerification = await database.updateDocument(
                APPWRITE_DATABASE_ID!,
                APPWRITE_USERS_COLLECTION_ID!,
                userId,
                { "premiumCard": true }
            )

            return parseStringify(updateAllowVerification);
        }


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
            APPWRITE_USED_CODE_COLLECTION_ID!, 
        );

        return parseStringify(pins.documents);
    } catch (error) {
        console.error('Error getting activation pins ', error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const deleteActivationPin = async (id: string, code: string) => {
    try {
        const { database } = await createAdminClient();

        await database.deleteDocument(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_USED_CODE_COLLECTION_ID!,
            id
        );

        const ativationCode = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_ACTIVATION_COLLECTION_ID!,
            [Query.equal('code', code)]
        );

        await database.deleteDocument(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_ACTIVATION_COLLECTION_ID!,
            ativationCode.documents[0].$id
        );

        const pins = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_USED_CODE_COLLECTION_ID!, 
        );

        return parseStringify(pins.documents);
    } catch (error) {
        console.error('Error deleting user: ', error);
    }
}


export const createPaymentMethod = async ({ logo, ...data }: PaymentMethod) => {

    try {
        const { database, storage } = await createAdminClient();

        const logoName = Math.floor(Math.random() * 900000000000) + 100000000000;

        await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_PAYMENT_METHOD_COLLECTION_ID!,
            ID.unique(),
            {
                ...data,
                logo: `${logoName}-${logo.name}`
            }
        )

        const { name, type } = logo;
        
        const imgWithEditedName = new File([logo], `${logoName}-${name}`, { type });

        await storage.createFile(
            APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
            ID.unique(),
            imgWithEditedName
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
    reciept: File | string, amount: string, 
    method: PaymentMethods, 
    time: string, userId: string, type: string) => {

    const template = handlebars.compile(WithdrawalEmailTemplate);

    try {
        const { database, storage } = await createAdminClient();

        const recieptName = Math.floor(Math.random() * 900000000000) + 100000000000;

        if(type === 'Withdrawal') {
            

            await database.createDocument(
                APPWRITE_DATABASE_ID!,
                APPWRITE_TRANSACTION_COLLECTION_ID!,
                ID.unique(),
                {
                    transaction_type: type,
                    transaction_method: 'Bank transfer',
                    transaction_status: 'pending',
                    amount: amount,
                    reciept: '',
                    transaction_time: time,
                    userId: userId,
                    transaction_details: {
                        type: 'Bank',
                        bankName: method.bankName,
                        accountName: method.accountName,
                        accountNumber: method.accountNumber,
                        currency: method.currency,
                    }
                }
            );


            const userEmail = await database.listDocuments(
                APPWRITE_DATABASE_ID!,
                APPWRITE_USERS_COLLECTION_ID!,
                [Query.equal('userId', userId)]
            )

            const withdrawalAmount = formatAmount(amount);


            const emailBody = template({
                name: `${userEmail.documents[0].firstname} ${userEmail.documents[0].lastname}`,
                amount: withdrawalAmount
            })
    
            const mailOptions = {
                from: 'Green apuestas <no-reply@greenapuestas.com>',
                to: userEmail.documents[0].email,
                subject: 'Withdrawal request',
                text: emailBody,
                html: emailBody
            };
    
            await transporter.sendMail(mailOptions);


            return 'success';
        }

        await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_TRANSACTION_COLLECTION_ID!,
            ID.unique(),
            {
                transaction_type: type,
                transaction_method: (method as PaymentMethods).type,
                transaction_status: 'pending',
                amount: amount,
                reciept: `${recieptName}-${(reciept as File).name}`,
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

        const { name, type: recieptType } = (reciept as File);

        const editedReciept = new File([(reciept as File)], `${recieptName}-${name}`, { type: recieptType });

        await storage.createFile(
            APPWRITE_PAYMENT_RECIEPT_LOGO_BUCKET_ID!,
            ID.unique(),
            editedReciept
        );

        return 'success';
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


export const transactionStatus = async (id: string, status: string) => {
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


export const userNotification = async (id: string, type: string, date: string, amount: string) => {
    try {
        const { database } = await createAdminClient();

        await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USER_NOTIFICATION_COLLECTION_ID!,
            ID.unique(),
            { 
                userId: id,
                date: date,
                type: type,
                amount: amount
            }
        )

        return 'success';
    } catch (error) {
        console.error("Error creating user bet notification ", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const getUserNotification = async () => {
    try {
        const { database } = await createAdminClient();

        const notifications = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USER_NOTIFICATION_COLLECTION_ID!,
        );

        return parseStringify(notifications.documents);

    } catch (error) {
        console.error("Error getting user bet notifications ", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const deleteUserNotification = async (id: string) => {
    try {
        const { database } = await createAdminClient();

        await database.deleteDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USER_NOTIFICATION_COLLECTION_ID!,
            id
        );

        return 'success';

    } catch (error) {
        console.error("Error deleting user bet notifications ", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const createGameTicket = async (data: UserGame) => {
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


export const updateGameTicket = async (data: UserGame) => {
    try {
        const { database } = await createAdminClient();

        await database.updateDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USER_BETS_COLLECTION_ID!,
            data.$id!,
            {
                'totalOdds': data.totalOdds,
                'stake': data.stake,
                'payout': data.payout,
            }
        )

        for(let i=0; i<data.games.length; i++) {

            console.log(i);
            console.log(data.games[i].$id!);


            await database.updateDocument(
                APPWRITE_DATABASE_ID!,
                APPWRITE_GAMES_COLLECTION_ID!,
                data.games[i].$id!,
                {
                    'home': data.games[i].home,
                    'away': data.games[i].away,
                    'odd': data.games[i].odd,
                    'homeGoal': data.games[i].homeGoal,
                    'awayGoal': data.games[i].awayGoal,
                    'matchTime': data.games[i].matchTime
                }
            )
        }

        return 'success';
        
    } catch (error) {
        console.error("Error updating game ticket ", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return 'Something went wrong, try again';
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const getGameTickets = async () => {
    try {
        const { database } = await createAdminClient();

        const slips = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USER_BETS_COLLECTION_ID!,
        );

        return parseStringify(slips.documents);
    } catch (error) {
        console.error("Error getting game tickets ", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}
  

export const showBetSlip = async (id: string, type: string) => {
    try {
        const { database } = await createAdminClient();

        const updated = await database.getDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USER_BETS_COLLECTION_ID!,
            id,
        )

        if(type === 'ticketWon') {

            await database.updateDocument(
                APPWRITE_DATABASE_ID!,
                APPWRITE_USER_BETS_COLLECTION_ID!,
                id,
                { 
                    'showBet': true,
                    'creditUser': true,
                }
            )
            return 'success';
        }

        await database.updateDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USER_BETS_COLLECTION_ID!,
            id,
            { 'showBet': !updated.showBet }
        )

        return 'success';
        
    } catch (error) {
        console.error("Error showing user bet slip", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const adminNotification = async (id: string, type: string, date: string, amount: string) => {
    try {
        const { database } = await createAdminClient();

        await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_ADMIN_NOTIFICATION_COLLECTION_ID!,
            ID.unique(),
            { 
                userId: id,
                date: date,
                type: type,
                amount: amount
            }
        )

        return 'success';
    } catch (error) {
        console.error("Error creating admin notification ", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const getAdminNotification = async () => {
    try {
        const { database } = await createAdminClient();

        const notifications = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_ADMIN_NOTIFICATION_COLLECTION_ID!,
        );

        return parseStringify(notifications.documents);

    } catch (error) {
        console.error("Error getting admin notifications ", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const deleteAdminNotification = async (id: string) => {
    try {
        const { database } = await createAdminClient();

        await database.deleteDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_ADMIN_NOTIFICATION_COLLECTION_ID!,
            id
        );

        return 'success';

    } catch (error) {
        console.error("Error deleting admin notifications ", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const creditUserBalance = async (userId: string, amount: string, type: string) => {
    try {
        const { database } = await createAdminClient();

        const user = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USERS_COLLECTION_ID!,
            [Query.equal('userId', userId)]
        )

        if(!user.documents.length) return;
        
        const id = user.documents[0].$id;
        let newBalance: number;

        if(type === 'credit') {
            newBalance = Number(user.documents[0].balance) + Number(amount);
        }
        
        if(type === 'deduct') {
            newBalance = Number(user.documents[0].balance) - Number(amount);
        }

        await database.updateDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USERS_COLLECTION_ID!,
            id,
            { 'balance': newBalance!.toString() }
        )

        return 'success';
    } catch (error) {
        console.error("Error crediting user balance", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const createBankDetails = async (userId: string, details: BankDetails) => {
    try {
        const { database } = await createAdminClient();

        await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_BANK_DETAILS_COLLECTION_ID!,
            ID.unique(),
            {
                userId,
                ...details
            }
        )

        return 'success';
    } catch (error) {
        console.error("Error creating bank detais", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const getBankDetails = async () => {
    try {
        const { database } = await createAdminClient();

        const detailsList = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_BANK_DETAILS_COLLECTION_ID!,
        )

        return parseStringify(detailsList.documents);
    } catch (error) {
        console.error("Error getting bank detais", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const deleteBankDetails = async (id: string) => {
    try {
        const { database } = await createAdminClient();

        await database.deleteDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_BANK_DETAILS_COLLECTION_ID!,
            id
        )

        return 'success';
    } catch (error) {
        console.error("Error deleting bank detais", error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const uploadDocument = async ({ front, back, ...data }: UploadDocument) => {

    try {
        const { database, storage } = await createAdminClient();

        const docImg = Math.floor(Math.random() * 900000000000) + 100000000000;

        await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_VERIFICATION_DOCUMENT_COLLECTION_ID!,
            ID.unique(),
            {
                ...data,
                front: `${docImg}-${front.name}`,
                back: `${docImg}-${back.name}`
            }
        )


        const { name: frontImg, type: frontImgType } = front;

        const { name: backImg, type: backImgType } = back;
        
        const forntImgEditedName = new File([front], `${docImg}-${frontImg}`, { type: frontImgType });
        
        const backImgEditedName = new File([back], `${docImg}-${backImg}`, { type: backImgType });


        await storage.createFile(
            APPWRITE_VERIFICATION_DOCUMENT_BUCKET_ID!,
            ID.unique(),
            forntImgEditedName
        )

        await storage.createFile(
            APPWRITE_VERIFICATION_DOCUMENT_BUCKET_ID!,
            ID.unique(),
            backImgEditedName
        )

        return 'success';
    } catch (error) {
        console.error('Error uploading verification documents', error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const getVerificationDocuments = async (): Promise<VerificationDocuments | string> => {
    try {
        const { database, storage } = await createAdminClient();

        const documents = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_VERIFICATION_DOCUMENT_COLLECTION_ID!,
        );

        const documentFiles = await storage.listFiles(
            APPWRITE_VERIFICATION_DOCUMENT_BUCKET_ID!
        );

        return parseStringify({ documents: documents.documents, files: documentFiles.files });
    } catch (error) {
        console.error('Error getting verification documents', error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, refresh the page and try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const approveDocumentVerification = async (id: string, type: string, action: string, userId: string) => {
    try {
        const { database, storage } = await createAdminClient();

        const document = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_VERIFICATION_DOCUMENT_COLLECTION_ID!,
            [Query.equal('userId', userId)]
        )

        const user = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USERS_COLLECTION_ID!,
            [Query.equal('userId', userId)]
        )


        if(action === 'approve' && ['National ID', 'Driving licence'].includes(type)) {

            const iDDoc = document.documents.find(doc => doc.$id === id);
            const addressDoc = document.documents.find(doc => doc.$id !== id);

            await database.updateDocument(
                APPWRITE_DATABASE_ID!,
                APPWRITE_VERIFICATION_DOCUMENT_COLLECTION_ID!,
                iDDoc!.$id,
                {
                    'ID_verification': true
                }
            )

            if(addressDoc && addressDoc.address_verification === true) {
                await database.updateDocument(
                    APPWRITE_DATABASE_ID!,
                    APPWRITE_USERS_COLLECTION_ID!,
                    user.documents[0].$id,
                    {
                        'identity_verified': true
                    }
                )
            }

            return 'success';
        }


        if(action === 'approve' && ['Utility bill', 'Bank statement', 'Card statement', 'Resident permit'].includes(type)) {

            const addressDoc = document.documents.find(doc => doc.$id === id);
            const iDDoc = document.documents.find(doc => doc.$id !== id);
            
            await database.updateDocument(
                APPWRITE_DATABASE_ID!,
                APPWRITE_VERIFICATION_DOCUMENT_COLLECTION_ID!,
                addressDoc!.$id,
                {
                    'address_verification': true
                }
            )

            if(iDDoc && iDDoc.ID_verification === true) {
                await database.updateDocument(
                    APPWRITE_DATABASE_ID!,
                    APPWRITE_USERS_COLLECTION_ID!,
                    user.documents[0].$id,
                    {
                        'identity_verified': true
                    }
                )
            }

            return 'success';
        }


        if(action === 'reject') {

            const doc = document.documents.find(doc => doc.$id === id);

            await database.deleteDocument(
                APPWRITE_DATABASE_ID!,
                APPWRITE_VERIFICATION_DOCUMENT_COLLECTION_ID!,
                doc!.$id
            )

            const front = await storage.listFiles(
                APPWRITE_VERIFICATION_DOCUMENT_BUCKET_ID!,
                [Query.equal('name', doc!.front)]
            )

            const back = await storage.listFiles(
                APPWRITE_VERIFICATION_DOCUMENT_BUCKET_ID!,
                [Query.equal('name', doc!.back)]
            )

            await storage.deleteFile(
                APPWRITE_VERIFICATION_DOCUMENT_BUCKET_ID!,
                front.files[0].$id
            )

            await storage.deleteFile(
                APPWRITE_VERIFICATION_DOCUMENT_BUCKET_ID!,
                back.files[0].$id
            )

            return 'success';
        }
    } catch (error) {
        console.error('Error handling document verification status', error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const createProfileImage = async (image: File, userId: string, userType: string) => {

    try {
        const { database, storage } = await createAdminClient();

        if(userType === 'admin') {
            const adminImg = await database.listDocuments(
                APPWRITE_DATABASE_ID!,
                APPWRITE_ADMIN_PROFILE_IMAGE_COLLECTION_ID!
            )

            if(adminImg.documents.length > 0) {
                const img = await storage.listFiles(
                    APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
                    [Query.equal('name', adminImg.documents[0].fileName)]
                )
    
                if(img.files[0].$id) {
                    await storage.deleteFile(
                        APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
                        img.files[0].$id
                    )
                }


                await database.updateDocument(
                    APPWRITE_DATABASE_ID!,
                    APPWRITE_ADMIN_PROFILE_IMAGE_COLLECTION_ID!,
                    adminImg.documents[0].$id,
                    { 'fileName': `${userId}-${image.name}` }
                )

                const { name, type } = image;
        
                const imgWithEditedName = new File([image], `${userId}-${name}`, { type })

                await storage.createFile(
                    APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
                    ID.unique(),
                    imgWithEditedName
                )

                return 'success';
            }

            await database.createDocument(
                APPWRITE_DATABASE_ID!,
                APPWRITE_ADMIN_PROFILE_IMAGE_COLLECTION_ID!,
                ID.unique(),
                {
                    userId: userId,
                    fileName: `${userId}-${image.name}`
                }
            )


            const { name, type } = image;
        
            const imgWithEditedName = new File([image], `${userId}-${name}`, { type })


            await storage.createFile(
                APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
                ID.unique(),
                imgWithEditedName
            )

            return 'success';
        }


        const user = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USERS_COLLECTION_ID!,
           [Query.equal('userId', userId)]
        )

        if(!user.documents.length) return;

        const databasseImage = user.documents[0].profileImg;

        if(databasseImage !== null) {
            const img = await storage.listFiles(
                APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
                [Query.equal('name', user.documents[0].profileImg)]
            )


            if(img.files[0].$id) {
                await storage.deleteFile(
                    APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
                    img.files[0].$id
                )
            }
        }

        await database.updateDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USERS_COLLECTION_ID!,
            user.documents[0].$id,
            { 'profileImg': `${userId}-${image.name}` }
        )
        

        const { name, type } = image;
        
        const imgWithEditedName = new File([image], `${userId}-${name}`, { type });

        await storage.createFile(
            APPWRITE_PAYMENT_METHOD_LOGO_BUCKET_ID!,
            ID.unique(),
            imgWithEditedName
        )

        return 'success';
    } catch (error) {
        console.error('Error creating profile image ', error);
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return `${(error as any)?.message}, try again`;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}


export const sendContactEmail = async (data: ContactEmailType) => {

    const template = handlebars.compile(contactEmailTemplate);

    try {
        
        const response = await zeroBounce.validateEmail(data.email);

        if(response.status === 'invalid') { return 'Please provide a valid email address'; }

        const emailBody = template({
            name: `${data.firstname} ${data.lastname}`,
            email: `${data.email}`,
            phone: `${data.phone}`,
            message: `${data.message}`
        })

        const mailOptions = {
            from: 'Green apuestas <no-reply@greenapuestas.com>',
            to: 'teamgreenapuestas@gmail.com',
            subject: 'Message from website visitor',
            text: data.message,
            html: emailBody
        };

        await transporter.sendMail(mailOptions);

        return 'success';
    } catch (error) {
        console.log('Error sending contact email', error);
    }
}


export const sendVerificationEmail = async () => {
    try {
        const { account } = await createSessionClient();

        await account.createVerification('https://greenapuestas.com/verifyEmail');
        
        return 'success';
    } catch (error) {
        console.log(error);
        return 'Something went wrong';
    }
}


export const verifyUserEmail = async (secret: string, userId: string) => {
    try {
        const { account } = await createSessionClient();
        const { database } = await createAdminClient();

        const user = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USERS_COLLECTION_ID!,
           [Query.equal('userId', userId)]
        );

        if(!user.documents.length) { return 'User not found' }

        await database.updateDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USERS_COLLECTION_ID!,
            user.documents[0].$id,
            { 'email_verified': true }
        );

        await account.updateVerification(userId, secret);
        
        return 'success';
    } catch (error) {
        console.log(error);
        return 'Something went wrong'
    }
}


export const accountVerificationEmail = async (name: string, type: string, action: string, email: string) => {
    const approveTemplate = handlebars.compile(approvedVerificationEmailTemplate);
    const rejectTemplate = handlebars.compile(rejectedVerificationEmailTemplate);
    try {

        if(['National ID', 'Driving licence'].includes(type)) {

            if(action === 'approve') {
                const emailBody = approveTemplate({
                    subject: `Identity verification approved`,
                    text: 'identity verification',
                    name: name,
                    type: type,
                    action: `approved`
                })

                const mailOptions = {
                    from: 'Green apuestas <no-reply@greenapuestas.com>',
                    to: email,
                    subject: `Identity verification approved`,
                    text: emailBody,
                    html: emailBody
                };
    
                await transporter.sendMail(mailOptions);

                return;
            }

            const emailBody = rejectTemplate({
                subject: `Identity verification rejected`,
                text: 'identity verification',
                name: name,
                type: type,
                action: `rejected`
            })

            const mailOptions = {
                from: 'Green apuestas <no-reply@greenapuestas.com>',
                to: email,
                subject: `Identity verification rejected`,
                text: emailBody,
                html: emailBody
            };

            await transporter.sendMail(mailOptions);

            return;
        }

        if(action === 'approve') {
            const emailBody = approveTemplate({
                subject: 'Address verification approved',
                text: 'address verification',
                name: name,
                type: type,
                action: 'approved'
            })

            const mailOptions = {
                from: 'Green apuestas <no-reply@greenapuestas.com>',
                to: email,
                subject: 'Address verification approved',
                text: emailBody,
                html: emailBody
            };
    
            await transporter.sendMail(mailOptions);

            return;
        }

        const emailBody = rejectTemplate({
            subject: 'Address verification rejected',
            text: 'address verification',
            name: name,
            type: type,
            action: 'rejected'
        })


        const mailOptions = {
            from: 'Green apuestas <no-reply@greenapuestas.com>',
            to: email,
            subject: 'Address verification rejected',
            text: emailBody,
            html: emailBody
        };

        await transporter.sendMail(mailOptions);
        
    } catch (error) {
        console.error('Error send account verification email', error);
    }
}