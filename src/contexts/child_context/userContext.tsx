'use client'

import { ReactNode, createContext, useContext, useState } from 'react'

interface UserType {
    user: object | null,
    setUser: (newUser: object | null) => void,
}

export const UserContext = createContext<UserType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<object | null>(null);


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