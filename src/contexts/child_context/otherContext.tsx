'use client'
import { getGameTickets, getPaymentMethods, getTransactions } from '@/lib/actions/userActions';
import { paymentMethodsWithImages, transactionsWithImages } from '@/lib/utils';
import { PaymentMethods, Transaction, UserGames } from '@/types/globals';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'


interface ContextType {
    paymentMethods: PaymentMethods[];
    setPaymentMethods: (newPaymentMethods: PaymentMethods[]) => void;

    transactions: Transaction[];
    setTransactions: (newTransactions: Transaction[]) => void;

    userSlips: UserGames[];
    setUserSlips: (newUserSlips: UserGames[]) => void;
}

export const OtherContext = createContext<ContextType | undefined>(undefined);

export const OtherProvider = ({ children } : { children: ReactNode }) => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userSlips, setUserSlips] = useState<UserGames[]>([]);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const payment = async () => {
            // Fetch logged-in user and all users only if needed
            try {
                const response = await getPaymentMethods();
                const transactionsResponse = await getTransactions();
                const slips = await getGameTickets();

                if(typeof response === 'string') return;

                if(typeof transactionsResponse === 'string') return;

                if(typeof slips === 'string') return;

                const methods = paymentMethodsWithImages(response);
                const trans = transactionsWithImages(transactionsResponse);
                setPaymentMethods(methods);
                setTransactions(trans);
                setUserSlips(slips);
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
            userSlips, setUserSlips
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