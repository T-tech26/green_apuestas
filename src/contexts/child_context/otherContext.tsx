'use client'
import { getAdminNotification, getGameTickets, getPaymentMethods, getTransactions, getUserNotification } from '@/lib/actions/userActions';
import { paymentMethodsWithImages, transactionsWithImages } from '@/lib/utils';
import { Notifications, PaymentMethods, Transaction, UserGame } from '@/types/globals';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'


interface ContextType {
    paymentMethods: PaymentMethods[];
    setPaymentMethods: (newPaymentMethods: PaymentMethods[]) => void;

    transactions: Transaction[];
    setTransactions: (newTransactions: Transaction[]) => void;

    userSlips: UserGame[];
    setUserSlips: (newUserSlips: UserGame[]) => void;

    userNotifications: Notifications[];
    setUserNotifications: (newBetNotification: Notifications[]) => void;

    adminNotifications: Notifications[];
    setAdminNotifications: (newAdminNotifications: Notifications[]) => void;
}

export const OtherContext = createContext<ContextType | undefined>(undefined);

export const OtherProvider = ({ children } : { children: ReactNode }) => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userSlips, setUserSlips] = useState<UserGame[]>([]);
    const [userNotifications, setUserNotifications] = useState<Notifications[]>([]);
    const [adminNotifications, setAdminNotifications] = useState<Notifications[]>([]);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const payment = async () => {
            try {
                const response = await getPaymentMethods();
                
                if(typeof response === 'string') return;
                const methods = paymentMethodsWithImages(response);
                setPaymentMethods(methods);

            } catch (error) {
                console.error("Error fetching payment methods:", error);
            }
        };

        payment();
    }, []);


    useEffect(() => {
        const transactions = async () => {
            try {
                const transactionsResponse = await getTransactions();
                
                if(typeof transactionsResponse === 'string') return;
                const trans = transactionsWithImages(transactionsResponse);
                setTransactions(trans);
            } catch (error) {
                console.error("Error fetching transactions data:", error);
            }
        };

        transactions();
    }, []);


    useEffect(() => {
        const tickets = async () => {
            try {
                const gameTickets = await getGameTickets();
                
                if(typeof gameTickets === 'string') return;
                setUserSlips(gameTickets);

            } catch (error) {
                console.error("Error fetching game tickets data:", error);
            }
        };

        tickets();
    }, []);


    useEffect(() => {
        const notification = async () => {
            try {
                const userNotifications = await getUserNotification();

                if(typeof userNotifications === 'string') return;
                setUserNotifications(userNotifications);

            } catch (error) {
                console.error("Error fetching user notification data:", error);
            }
        };

        notification();
    }, []);


    useEffect(() => {
        const adminNot = async () => {
            try {
                const adminNotification = await getAdminNotification();
                
                if(typeof adminNotification === 'string') return;
                setAdminNotifications(adminNotification);

            } catch (error) {
                console.error("Error fetching admin notification data:", error);
            }
        };

        adminNot();
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