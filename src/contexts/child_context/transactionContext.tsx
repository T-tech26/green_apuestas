'use client'
import { getBankDetails, getPaymentMethods, getTransactions } from "@/lib/actions/userActions";
import { paymentMethodsWithImages, transactionsWithImages } from "@/lib/utils";
import { BankDetails, PaymentMethods, Transaction } from "@/types/globals";
import { createContext, ReactNode, useContext, useState } from "react";


interface ContextType {
    paymentMethods: PaymentMethods[];
    setPaymentMethods: (newPaymentMethods: PaymentMethods[]) => void;

    paymentMethodsLoading: boolean,
    setPaymentMethodsLoading: (newPayMethod: boolean) => void,

    transactions: Transaction[];
    setTransactions: (newTransactions: Transaction[]) => void;

    transactionsLoading: boolean,
    setTransactionsLoading: (newTrans: boolean) => void,

    bankDetails: BankDetails[];
    setBankDetails: (newBankDetails: BankDetails[]) => void;

    bankDetailsLoading: boolean,
    setBankDetailsLoading: (newBAnkDetails: boolean) => void,

    getAllTransactions: () => void,

    getAllPaymentMethods: () => void,

    getAllBankDetails: () => void
}



export const TransactionContext = createContext<ContextType | undefined>(undefined);



export const TransactionProvider = ({ children } : { children: ReactNode }) => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([])
    const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);
    const [bankDetailsLoading, setBankDetailsLoading] = useState(true);


    const getAllPaymentMethods = async () => {
        try {
            const response = await getPaymentMethods();
            
            if(typeof response === 'string') return;
            const methods = paymentMethodsWithImages(response);
            setPaymentMethods(methods);

        } catch (error) {
            console.error("Error fetching payment methods:", error);
        } finally {
            if(!paymentMethods.length) {
                setPaymentMethodsLoading(false);
            }
        }
    };


    const getAllTransactions = async () => {
        try {
            const transactionsResponse = await getTransactions();
            
            if(typeof transactionsResponse === 'string') return;
            const trans = transactionsWithImages(transactionsResponse);
            setTransactions(trans);
        } catch (error) {
            console.error("Error fetching transactions data:", error);
        } finally { 
            if(!transactions.length) {
                setTransactionsLoading(false);
            }
        }
    };


    const getAllBankDetails = async () => {   
        try {
            const fetchedBankDetails = await getBankDetails();
            
            if(typeof fetchedBankDetails === 'string') return;
            setBankDetails(fetchedBankDetails);

        } catch (error) {
            console.error("Error fetching users bank details:", error);
        } finally { 
            if(!bankDetails.length) {
                setBankDetailsLoading(false); }
            }
    };


    return (
        <TransactionContext.Provider value={{
            paymentMethods, setPaymentMethods, transactions, setTransactions,
            bankDetails, setBankDetails, getAllTransactions, transactionsLoading,
            setTransactionsLoading, paymentMethodsLoading, setPaymentMethodsLoading, getAllPaymentMethods,
            getAllBankDetails, bankDetailsLoading, setBankDetailsLoading
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