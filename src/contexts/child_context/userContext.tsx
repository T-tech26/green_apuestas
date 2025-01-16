'use client'

import { getAllUsers, getLoggedInUser } from '@/lib/actions/userActions';
import { allUsersWithImages, isAdmin, isUserData, loggedInAdminWithImage, loggedInUserWithImage } from '@/lib/utils';
import { Admin, UserData } from '@/types/globals';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface UserType {
    user: UserData | string,
    setUser: (newUser: UserData | string) => void,

    admin: Admin,
    setAdmin: (newAdmin: Admin) => void,

    allUsers: UserData[],
    setAllUsers: (newUser: UserData[]) => void,

    isLoading: boolean,
    setIsLoading: (newIsLoading: boolean) => void,
}

export const UserContext = createContext<UserType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | string>('');
    const [allUsers, setAllUsers] = useState<UserData[]>([]);
    const [admin, setAdmin] = useState<Admin>({ $id: '', name: '', label: [] });
    const [isLoading, setIsLoading] = useState(true);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const login = async () => {
            // Fetch logged-in user and all users only if needed
            try {
                const user = await getLoggedInUser();
                const users = await getAllUsers();

                if (typeof user === "object" && typeof users === 'object') {
                    
                    const usersWithImage = allUsersWithImages(users);
                    setAllUsers(usersWithImage);

                    if(isAdmin(user)) { 
                        const adminWithImage = loggedInAdminWithImage(user);
                        setAdmin(adminWithImage); 
                        setIsLoading(false);
                        return;
                    }

                    if(isUserData(user)) { 
                        const userWithImage = loggedInUserWithImage(user);
                        setUser(userWithImage); 
                    }
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