import { getBankDetails, getPaymentMethods, getTransactions } from "@/lib/actions/userActions";
import { paymentMethodsWithImages, transactionsWithImages } from "@/lib/utils";
import { BankDetails, PaymentMethods, Transaction } from "@/types/globals";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


interface ContextType {
    paymentMethods: PaymentMethods[];
    setPaymentMethods: (newPaymentMethods: PaymentMethods[]) => void;

    transactions: Transaction[];
    setTransactions: (newTransactions: Transaction[]) => void;

    bankDetails: BankDetails[];
    setBankDetails: (newBankDetails: BankDetails[]) => void;
}



export const TransactionContext = createContext<ContextType | undefined>(undefined);



export const TransactionProvider = ({ children } : { children: ReactNode }) => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);


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
        const details = async () => {
            try {
                const bankDetails = await getBankDetails();
                
                if(typeof bankDetails === 'string') return;
                setBankDetails(bankDetails);

            } catch (error) {
                console.error("Error fetching users bank details:", error);
            }
        };

        details();
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */


    return (
        <TransactionContext.Provider value={{
            paymentMethods, setPaymentMethods, transactions, setTransactions,
            bankDetails, setBankDetails,
        }}>
            {children}
        </TransactionContext.Provider>
    )
}


export const useTransactionContext = (): ContextType => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useUser must be used within a userProvider');
    }
    return context;
};