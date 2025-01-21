'use client'
import { getAdminNotification, getUserNotification } from "@/lib/actions/userActions";
import { Notifications } from "@/types/globals";
import { createContext, ReactNode, useContext, useState } from "react";



interface ContextType {
    userNotifications: Notifications[];
    setUserNotifications: (newBetNotification: Notifications[]) => void;

    adminNotifications: Notifications[];
    setAdminNotifications: (newAdminNotifications: Notifications[]) => void;

    getAlladminNotification: () => void;

    getAllUserNotification: () => void;
}



export const NotificationContext = createContext<ContextType | undefined>(undefined);



export const NotificationProvider = ({ children } : { children: ReactNode }) => {
    const [userNotifications, setUserNotifications] = useState<Notifications[]>([]);
    const [adminNotifications, setAdminNotifications] = useState<Notifications[]>([]);


    const getAllUserNotification = async () => {
        try {
            const userNotifications = await getUserNotification();

            if(typeof userNotifications === 'string') return;
            setUserNotifications(userNotifications);

        } catch (error) {
            console.error("Error fetching user notification data:", error);
        }
    };


    const getAlladminNotification = async () => {
        try {
            const adminNotification = await getAdminNotification();
            
            if(typeof adminNotification === 'string') return;
            setAdminNotifications(adminNotification);

        } catch (error) {
            console.error("Error fetching admin notification data:", error);
        }
    };


    return (
        <NotificationContext.Provider value={{
            userNotifications, setUserNotifications, getAllUserNotification,
            adminNotifications, setAdminNotifications, getAlladminNotification
        }}>
            {children}
        </NotificationContext.Provider>
    )
}


export const useNotificationContext = (): ContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useUser must be used within a userProvider');
    }
    return context;
};