'use client'
import { getGameTickets, getVerificationDocuments } from '@/lib/actions/userActions';
import { verificationDocumentWithImages } from '@/lib/utils';
import { UserGame, VerificationDocument } from '@/types/globals';
import React, { createContext, ReactNode, useContext, useState } from 'react'


interface ContextType {
    userSlips: UserGame[];
    setUserSlips: (newUserSlips: UserGame[]) => void;

    userSlipsLoading: boolean,
    setUserSlipsLoading: (newSlip: boolean) => void,

    verificationDocuments: VerificationDocument[];
    setVerificaitonDocuments: (newVerificationDocuments: VerificationDocument[]) => void;

    verificationDocumentsLoading: boolean,
    setVerificationDocumentsLoading: (newVerifyDoc: boolean) => void,

    getUserSlips: () => void,

    getAllVerification: () => void,
}

export const UserSlipContext = createContext<ContextType | undefined>(undefined);

export const UserSlipProvider = ({ children } : { children: ReactNode }) => {
    const [userSlips, setUserSlips] = useState<UserGame[]>([]);
    const [userSlipsLoading, setUserSlipsLoading] = useState(true);
    const [verificationDocuments, setVerificaitonDocuments] = useState<VerificationDocument[]>([]);
    const [verificationDocumentsLoading, setVerificationDocumentsLoading] = useState(true);


    const getAllVerification = async () => {
        if(!verificationDocuments.length) {
            try {
                const response = await getVerificationDocuments();
                
                if(typeof response === 'string') return;
                const documents= verificationDocumentWithImages(response);
                setVerificaitonDocuments(documents);

            } catch (error) {
                console.error("Error fetching verification documents:", error);
            } finally {
                if(!verificationDocuments.length)  {
                    setVerificationDocumentsLoading(false);
                }
            }
        }
    };


    const getUserSlips = async () => {
        try {
            const gameTickets = await getGameTickets();
            
            if(typeof gameTickets === 'string') return;
            setUserSlips(gameTickets);

        } catch (error) {
            console.error("Error fetching game tickets data:", error);
        } finally {
            if(!userSlips.length) {
                setUserSlipsLoading(false);
            }
        }
    }


    return (
        <UserSlipContext.Provider value={{
            userSlips, setUserSlips, verificationDocuments, setVerificaitonDocuments,
            getUserSlips, verificationDocumentsLoading, setVerificationDocumentsLoading, getAllVerification,
            userSlipsLoading, setUserSlipsLoading
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