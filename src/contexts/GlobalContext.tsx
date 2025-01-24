import { UserProvider } from "./child_context/userContext";
import { ReactNode } from "react";
import { UserSlipProvider } from "./child_context/userSlipContext";
import { NotificationProvider } from "./child_context/notificationContext";
import { TransactionProvider } from "./child_context/transactionContext";


export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    return (
        <UserSlipProvider>
            <NotificationProvider>
                <TransactionProvider>
                    <UserProvider>
                        {children}
                    </UserProvider>
                </TransactionProvider>
            </NotificationProvider>
        </UserSlipProvider>
    );
};