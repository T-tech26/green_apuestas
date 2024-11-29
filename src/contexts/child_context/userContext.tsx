'use client'

import { UserData } from '@/types/globals';
import { ReactNode, createContext, useContext, useState } from 'react'

interface UserType {
    user: UserData | string,
    setUser: (newUser: UserData | string) => void,
}

export const UserContext = createContext<UserType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | string>('');


    return (
        <UserContext.Provider value={{
            user, setUser,
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = (): UserType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a userProvider');
    }
    return context;
};