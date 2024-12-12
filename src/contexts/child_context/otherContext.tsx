'use client'
import { toast } from '@/hooks/use-toast';
import { getPaymentMethods } from '@/lib/actions/userActions';
import { paymentMethodsWithImages } from '@/lib/utils';
import { PaymentMethods } from '@/types/globals';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'


interface ContextType {
    paymentMethods: PaymentMethods[];
    setPaymentMethods: (newPaymentMethods: PaymentMethods[]) => void;
}

export const OtherContext = createContext<ContextType | undefined>(undefined);

export const OtherProvider = ({ children } : { children: ReactNode }) => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([])


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const payment = async () => {
            // Fetch logged-in user and all users only if needed
            try {
                const response = await getPaymentMethods();

                if(typeof response === 'string'){
                    toast({
                        description: response
                    })
                    return;
                }
                
                const methods = paymentMethodsWithImages(response);
                setPaymentMethods(methods);
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
            paymentMethods, setPaymentMethods
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