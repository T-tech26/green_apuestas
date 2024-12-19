'use client'
import { getAdminNotification, getGameTickets, getPaymentMethods, getTransactions, getUserNotification } from '@/lib/actions/userActions';
import { paymentMethodsWithImages, transactionsWithImages } from '@/lib/utils';
import { BetNotifications, Notifications, PaymentMethods, Transaction, UserGame } from '@/types/globals';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'


interface ContextType {
    paymentMethods: PaymentMethods[];
    setPaymentMethods: (newPaymentMethods: PaymentMethods[]) => void;

    transactions: Transaction[];
    setTransactions: (newTransactions: Transaction[]) => void;

    userSlips: UserGame[];
    setUserSlips: (newUserSlips: UserGame[]) => void;

    userNotifications: BetNotifications[];
    setUserNotifications: (newBetNotification: BetNotifications[]) => void;

    adminNotifications: Notifications[];
    setAdminNotifications: (newAdminNotifications: Notifications[]) => void;
}

export const OtherContext = createContext<ContextType | undefined>(undefined);

export const OtherProvider = ({ children } : { children: ReactNode }) => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userSlips, setUserSlips] = useState<UserGame[]>([]);
    const [userNotifications, setUserNotifications] = useState<BetNotifications[]>([]);
    const [adminNotifications, setAdminNotifications] = useState<Notifications[]>([]);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const payment = async () => {
            // Fetch logged-in user and all users only if needed
            try {
                const response = await getPaymentMethods();
                const transactionsResponse = await getTransactions();
                const slips = await getGameTickets();
                const notifications = await getUserNotification();
                const adminNot = await getAdminNotification();

                if(typeof response === 'string') return;
                const methods = paymentMethodsWithImages(response);
                setPaymentMethods(methods);

                if(typeof transactionsResponse === 'string') return;
                const trans = transactionsWithImages(transactionsResponse);
                setTransactions(trans);

                if(typeof slips === 'string') return;
                setUserSlips(slips);

                if(typeof notifications === 'string') return;
                setUserNotifications(notifications);

                if(typeof adminNot === 'string') return;
                setAdminNotifications(adminNot);

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        // Call the paymet method function
        payment();
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */


    return (
        <OtherContext.Provider value={{
            paymentMethods, setPaymentMethods, transactions, setTransactions,
            userSlips, setUserSlips, userNotifications, setUserNotifications,
            adminNotifications, setAdminNotifications
        }}>
            {children}
        </OtherContext.Provider>
    )
}


export const useOtherContext = (): ContextType => {
    const context = useContext(OtherContext);
    if (!context) {
        throw new Error('useUser must be used within a userProvider');
    }
    return context;
};