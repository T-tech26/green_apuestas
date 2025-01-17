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

    allUsersLoading: boolean,
    setAllUsersLoading: (newUser: boolean) => void,

    loginUserLoading: boolean,
    setLoginUserLoading: (newIsLoading: boolean) => void,

    getUsers: () => void,

    loginUser: () => void,
}

export const UserContext = createContext<UserType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | string>('');
    const [allUsers, setAllUsers] = useState<UserData[]>([]);
    const [allUsersLoading, setAllUsersLoading] = useState(true);
    const [admin, setAdmin] = useState<Admin>({ $id: '', name: '', label: [] });
    const [loginUserLoading, setLoginUserLoading] = useState(true);



    const loginUser = async () => {
        // Fetch logged-in user and all users only if needed
        try {
            const user = await getLoggedInUser();

            if (typeof user === "object") {

                if(isAdmin(user)) { 
                    const adminWithImage = loggedInAdminWithImage(user);
                    setAdmin(adminWithImage); 
                    setLoginUserLoading(false);
                    return;
                }

                if(isUserData(user)) { 
                    const userWithImage = loggedInUserWithImage(user);
                    setUser(userWithImage); 
                }

                setLoginUserLoading(false);
            }

            if(user === 'No session') { setLoginUserLoading(false); }
        } catch (error) {
            console.error("Error fetching user data:", error)
        }
    };


    const getUsers = async () => {
        // Fetch logged-in user and all users only if needed
        if(!allUsers.length) {
            try {
                const users = await getAllUsers();

                const usersWithImage = allUsersWithImages(users);
                setAllUsers(usersWithImage);
            } catch (error) {
                console.error("Error fetching user data:", error)
            } finally {
                if(!allUsers.length) {
                    setAllUsersLoading(false);
                }
            }
        }
    };


    return (
        <UserContext.Provider value={{
            user, setUser, allUsers, setAllUsers,
            admin, setAdmin, loginUserLoading, setLoginUserLoading, 
            getUsers, allUsersLoading, setAllUsersLoading, loginUser
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