'use client'

import { getAllUsers, getLoggedInUser } from '@/lib/actions/userActions';
import { isAdmin, isUserData } from '@/lib/utils';
import { Admin, UserData } from '@/types/globals';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface UserType {
    user: UserData | string,
    setUser: (newUser: UserData | string) => void,

    admin: Admin,
    setAdmin: (newAdmin: Admin) => void,

    allUsers: UserData[] | string,
    setAllUsers: (newUser: UserData[] | string) => void,

    isLoading: boolean,
    setIsLoading: (newIsLoading: boolean) => void,
}

export const UserContext = createContext<UserType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | string>('');
    const [allUsers, setAllUsers] = useState<UserData[] | string>('');
    const [admin, setAdmin] = useState<Admin>({ name: '', label: [] });
    const [isLoading, setIsLoading] = useState(true);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const login = async () => {
            // Fetch logged-in user and all users only if needed
            try {
                const user = await getLoggedInUser();
                const users = await getAllUsers();

                if (typeof user === "object" && Array.isArray(users)) {

                    if(isAdmin(user)) { setAdmin(user); }
                    if(isUserData(user)) { setUser(user); }
                    setAllUsers(users);
                    setIsLoading(false);
                }

                if(user === 'No session') { setIsLoading(false); }
            } catch (error) {
                console.error("Error fetching user data:", error)
            }
        };

        // Call the login function
        login();
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */


    return (
        <UserContext.Provider value={{
            user, setUser, allUsers, setAllUsers,
            admin, setAdmin, isLoading, setIsLoading
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