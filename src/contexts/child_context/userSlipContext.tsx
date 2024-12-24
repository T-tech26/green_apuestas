'use client'
import { getGameTickets, getVerificationDocuments } from '@/lib/actions/userActions';
import { verificationDocumentWithImages } from '@/lib/utils';
import { UserGame, VerificationDocument } from '@/types/globals';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'


interface ContextType {
    userSlips: UserGame[];
    setUserSlips: (newUserSlips: UserGame[]) => void;

    verificationDocuments: VerificationDocument[];
    setVerificaitonDocuments: (newVerificationDocuments: VerificationDocument[]) => void;
}

export const UserSlipContext = createContext<ContextType | undefined>(undefined);

export const UserSlipProvider = ({ children } : { children: ReactNode }) => {
    const [userSlips, setUserSlips] = useState<UserGame[]>([]);
    const [verificationDocuments, setVerificaitonDocuments] = useState<VerificationDocument[]>([]);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const tickets = async () => {
            try {
                const gameTickets = await getGameTickets();
                
                if(typeof gameTickets === 'string') return;
                setUserSlips(gameTickets);

            } catch (error) {
                console.error("Error fetching game tickets data:", error);
            }
        };

        tickets();
    }, []);


    useEffect(() => {
        const verification = async () => {
            try {
                const response = await getVerificationDocuments();
                
                if(typeof response === 'string') return;
                const documents= verificationDocumentWithImages(response);
                setVerificaitonDocuments(documents);

            } catch (error) {
                console.error("Error fetching verification documents:", error);
            }
        };

        verification();
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */


    return (
        <UserSlipContext.Provider value={{
            userSlips, setUserSlips, verificationDocuments, setVerificaitonDocuments
        }}>
            {children}
        </UserSlipContext.Provider>
    )
}


export const useUserSlipContext = (): ContextType => {
    const context = useContext(UserSlipContext);
    if (!context) {
        throw new Error('useUser must be used within a userProvider');
    }
    return context;
};