'use client'

import { getAllUsers, getLoggedInUser } from '@/lib/actions/userActions';
import { UserData } from '@/types/globals';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface UserType {
    user: UserData | string,
    setUser: (newUser: UserData | string) => void,

    allUsers: UserData[] | string,
    setAllUsers: (newUser: UserData[] | string) => void,
}

export const UserContext = createContext<UserType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | string>('');
    const [allUsers, setAllUsers] = useState<UserData[] | string>('');


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const login = async () => {
            // Fetch logged-in user and all users only if needed
            try {
                const response = await getLoggedInUser();
                const users = await getAllUsers();

                if (typeof response === "object" && Array.isArray(users)) {
                    setUser(response);
                    setAllUsers(users);
                } else if (typeof response !== "object") {
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        // Call the login function
        login();
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */


    return (
        <UserContext.Provider value={{
            user, setUser, allUsers, setAllUsers
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