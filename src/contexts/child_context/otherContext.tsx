'use client'
import { getPaymentMethods, getTransactions } from '@/lib/actions/userActions';
import { paymentMethodsWithImages, transactionsWithImages } from '@/lib/utils';
import { PaymentMethods, Transaction } from '@/types/globals';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'


interface ContextType {
    paymentMethods: PaymentMethods[];
    setPaymentMethods: (newPaymentMethods: PaymentMethods[]) => void;

    transactions: Transaction[];
    setTransactions: (newTransactions: Transaction[]) => void;
}

export const OtherContext = createContext<ContextType | undefined>(undefined);

export const OtherProvider = ({ children } : { children: ReactNode }) => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([]);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const payment = async () => {
            // Fetch logged-in user and all users only if needed
            try {
                const response = await getPaymentMethods();
                const transactionsResponse = await getTransactions();

                if(typeof response === 'string') return;

                if(typeof transactionsResponse === 'string') return;
                
                const methods = paymentMethodsWithImages(response);
                const trans = transactionsWithImages(transactionsResponse);
                setPaymentMethods(methods);
                setTransactions(trans);
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
            paymentMethods, setPaymentMethods, transactions, setTransactions
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