'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/child_context/userContext'
import { UserData, VerificationDocument } from '@/types/globals'
import { useOtherContext } from '@/contexts/child_context/otherContext'
import DocumentVerificationForm from '@/components/DocumentVerificationForm'
import AllowVerification from '@/components/AllowVerification'

const IdentityVerification = () => {

    const { user } = useUser();
    const { verificationDocuments } = useOtherContext();

    const [step, setStep] = useState('ID');
    const [idDocument, setIdDocument] = useState<VerificationDocument[]>([]);
    const [addressDocument, setAddressDocument] = useState<VerificationDocument[]>([]);


    
    useEffect(() => {
        if(verificationDocuments.length > 0) {
            const ID = verificationDocuments.filter((doc: VerificationDocument) => doc.type === 'National ID' && doc.userId === (user as UserData).userId);
            const driving = verificationDocuments.filter((doc: VerificationDocument) => doc.type === 'Driving licence'  && doc.userId === (user as UserData).userId);
            const utility = verificationDocuments.filter((doc: VerificationDocument) => doc.type === 'Utility bill' && doc.userId === (user as UserData).userId);
            const bankStatement = verificationDocuments.filter((doc: VerificationDocument) => doc.type === 'Bank statement'  && doc.userId === (user as UserData).userId);
            const cardStatement = verificationDocuments.filter((doc: VerificationDocument) => doc.type === 'Card statement' && doc.userId === (user as UserData).userId);
            const residentPermit = verificationDocuments.filter((doc: VerificationDocument) => doc.type === 'Resident permit'  && doc.userId === (user as UserData).userId);

            const IDverificaton = ID.length > 0 ? ID : driving.length > 0 ? driving : [];

            setIdDocument(IDverificaton)
            
            const addressVerification = utility.length > 0 ? utility
                : bankStatement.length > 0 ? bankStatement
                    : cardStatement.length > 0 ? cardStatement
                        : residentPermit.length > 0 ? residentPermit
                            : [];

            setAddressDocument(addressVerification);

        }
    }, [verificationDocuments, user])



    return (
        <main className='flex-1 py-14 overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-4'>
                <h1 className='text-lg text-color-60 font-medium mb-5'>IDENTITY VERIFICATION</h1>

                <div className='flex items-center gap-5'>
                    <p 
                        className={`w-full py-12 flex items-center justify-center gap-3 border rounded-lg ${
                                idDocument.length > 0 && idDocument[0].ID_verification ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                            }`}
                    >
                        Identity verification 
                        
                        {
                            idDocument.length > 0 && idDocument[0].ID_verification ? <span className='text-xs text-green-300'>Approved</span> 
                                : idDocument.length > 0 && idDocument[0].ID_verification === false ? <span className='text-xs text-red-300'>pending</span> : ''
                        }

                        {idDocument.length > 0 && idDocument[0].ID_verification ? (
                            <Image
                                src='green-dot-icon.svg'
                                width={15}
                                height={15}
                                alt='identity not verified icon'
                            />                            
                        ) : (
                            <Image
                                src='red-dot-icon.svg'
                                width={15}
                                height={15}
                                alt='identity not verified icon'
                            />                            
                        )}
                    </p>

                    <p 
                        className={`w-full py-12 flex items-center justify-center gap-3 border rounded-lg ${
                            addressDocument.length > 0 && addressDocument[0].address_verification ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                        }`}
                    >
                        Proof of address 

                        {
                            addressDocument.length > 0 && addressDocument[0].address_verification ? <span className='text-xs text-green-300'>Approved</span> : addressDocument.length > 0 && addressDocument[0].address_verification === false ? <span className='text-xs text-red-300'>pending</span> : ''
                        }

                        {addressDocument.length > 0 && addressDocument[0].address_verification ? (
                            <Image
                                src='green-dot-icon.svg'
                                width={15}
                                height={15}
                                alt='identity not verified icon'
                            />                            
                        ) : (
                            <Image
                                src='red-dot-icon.svg'
                                width={15}
                                height={15}
                                alt='identity not verified icon'
                            />                            
                        )}                         
                    </p>
                </div>

                <div
                    className='flex items-center flex-wrap py-3'
                >
                    <Button 
                        type='button'
                        className={`rounded-none bg-dark-gradient-135deg hover:bg-light-gradient-135deg focus:outline-none outline-none
                            ${
                            step === 'ID' ? 'bg-light-gradient-135deg' : ''
                        }`}
                        onClick={() => setStep('ID')}
                    >
                        Identity verification
                    </Button>

                    <Button 
                        type='button'
                        className={`rounded-none bg-dark-gradient-135deg hover:bg-light-gradient-135deg focus:outline-none outline-none
                            ${
                            step === 'address' ? 'bg-light-gradient-135deg' : ''
                        }`}
                        onClick={() => setStep('address')}
                    >
                        Proof of address
                    </Button>
                </div>


                {step === 'ID' && idDocument.length === 0 && (
                    <DocumentVerificationForm type='ID' />
                )}


                {step === 'address' && addressDocument.length === 0 && (
                    <DocumentVerificationForm type='address' />
                )}
            </div>

            {(user as UserData).allowVerification === false && (
                <AllowVerification id={(user as UserData).$id} type='verification' />
            )}
        </main>
    )
}

export default IdentityVerification