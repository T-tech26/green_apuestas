'use client'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/child_context/userContext'
import { UserData, VerificationDocument } from '@/types/globals'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import KYCLogDetails from '@/components/KYCLogDetails'
import { useUserSlipContext } from '@/contexts/child_context/userSlipContext'



interface DocWithUser {
    doc: VerificationDocument,
    user: UserData
}



const KYCVerification = () => {

    const { allUsers, getUsers, setAllUsersLoading } = useUser();
    const { verificationDocuments, verificationDocumentsLoading, setVerificationDocumentsLoading, getAllVerification } = useUserSlipContext();
        
    const [status, setStatus] = useState('pending');
    const [pendingDocuments, setPendingDocuments] = useState<DocWithUser[]>([]);
    const [approvedDocuments, setApprovedDocuments] = useState<DocWithUser[]>([]);
    const [showDetails, setShowDetails] = useState<DocWithUser | string>('');


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if(verificationDocuments.length > 0 && allUsers.length > 0) {
            const userWithIdDocument: DocWithUser[] = verificationDocuments.map((doc: VerificationDocument) => {

                const user = allUsers.find(user => user.userId === doc.userId);
                
                if(user) {
                    return {
                        doc,
                        user
                    }
                }

                return null;
            }).filter((item): item is DocWithUser => item !== null);

            const pending = userWithIdDocument.filter(doc => doc.doc.ID_verification === false && doc.doc.address_verification === false);
            const approved = userWithIdDocument.filter(doc => doc.doc.ID_verification === true || doc.doc.address_verification === true);

            setPendingDocuments(pending);
            setApprovedDocuments(approved);
            setVerificationDocumentsLoading(false);
            setAllUsersLoading(false);
        }
    }, [verificationDocuments, allUsers]);


    useEffect(() => {
        if(!verificationDocuments.length) {
            getAllVerification();
        }
        if(!allUsers.length) {
            getUsers();
        }
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */



    return (
        <main className='flex-1 pt-14 md:py-14 overflow-x-hidden overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-5 overflow-x-scroll md:overflow-x-hidden address pb-14 md:pb-0'>
                <h1 className='text-lg text-color-60 font-medium uppercase'>KYC verification</h1>

                <div
                    className='flex items-center flex-wrap py-3'
                >
                    <Button 
                        type='button'
                        className={`rounded-none bg-dark-gradient-135deg hover:bg-light-gradient-135deg focus:outline-none outline-none
                            ${
                                status === 'pending' ? 'bg-light-gradient-135deg' : ''
                        }`}
                        onClick={() => setStatus('pending')}
                    >
                        Pending
                    </Button>

                    <Button 
                        type='button'
                        className={`rounded-none bg-dark-gradient-135deg hover:bg-light-gradient-135deg focus:outline-none outline-none
                            ${
                                status === 'approved' ? 'bg-light-gradient-135deg' : ''
                        }`}
                        onClick={() => setStatus('approved')}
                    >
                        Approved
                    </Button>
                </div>

                {status === 'pending' && (
                    <div className='w-full min-w-[400px] mx-auto'>
                        {pendingDocuments.length > 0 ? (
                            <>
                                {pendingDocuments.map(item => {
                                    return (
                                        <div 
                                            key={item.doc.$id}
                                            className='bg-white drop-shadow-md rounded-md mb-3 px-3 py-2 border border-gray-200 hover:bg-gray-50 hover:border-color-10 hover:border'
                                        >
                                            <div className='flex items-center justify-between'>
                                                <p className='text-sm text-color-60 font-semibold'>Verification Type</p>

                                                <p 
                                                    className='text-xs text-gray-400 hover:text-color-10 hover:underline cursor-pointer'
                                                    onClick={() => setShowDetails(item)}
                                                >Show details</p>

                                                <p className='text-xs text-gray-400'>
                                                    {
                                                        item.doc.type === 'National ID' ? 'Identity verification'
                                                        : item.doc.type === 'Driving licence' ? 'Identity verification'
                                                            : item.doc.type === 'Utility bill' ? 'Address verification'
                                                                : item.doc.type === 'Bank statement' ? 'Address verification'
                                                                    : item.doc.type === 'Card statement' ? 'Address verification'
                                                                        : item.doc.type === 'Resident permit' ? 'Address verification'
                                                                            : ''
                                                    }
                                                </p>
                                            </div>

                                            <div className='flex items-center justify-between border-t border-gray-300 py-3'>
                                                <div>
                                                    <p className='text-xs text-gray-400 font-medium mb-1'>Document Type</p>
                                                    <p className='text-[10px] text-color-60'>{item.doc.type}</p>
                                                </div>

                                                <div>
                                                    <p className='text-xs text-gray-400 font-medium mb-1'>Account name</p>
                                                    <p className='text-[10px] text-color-60'>{item.user.firstname} {item.user.lastname}</p>
                                                </div>
                                                
                                                <p className='flex flex-col gap-2 text-xs'>
                                                    <span className='font-semibold text-gray-400'>
                                                        Status
                                                    </span>

                                                    {['National ID', 'Driving licence'].includes(item.doc.type) && (
                                                        <span 
                                                            className='text-[10px] flex items-center gap-1 drop-shadow-md rounded-full pl-2 pr-3 text-red-400 bg-red-200'
                                                        >
                                                            <Image
                                                                src='/red-dot-icon.svg'
                                                                width={10}
                                                                height={10}
                                                                alt='pending verification icon'
                                                            />
                                                            Pending
                                                        </span>
                                                    )}


                                                    {['Utility bill', 'Bank statement', 'Card statement', 'Resident permit'].includes(item.doc.type) && (
                                                        <span 
                                                            className='text-[10px] flex items-center gap-1 drop-shadow-md rounded-full pl-2 pr-3 text-red-400 bg-red-200'
                                                        >
                                                            <Image
                                                                src='/red-dot-icon.svg'
                                                                width={10}
                                                                height={10}
                                                                alt='pending or approved verification icon'
                                                            />
                                                            Pending
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        ) : verificationDocumentsLoading ? (
                            <div className="w-full animate-pulse flex flex-col gap-1">
                                <div className='w-full h-16 bg-gray-300'></div>
                                <div className='w-full h-16 bg-gray-300'></div>
                                <div className='w-full h-16 bg-gray-300'></div>
                            </div>
                        ) : (
                            <div className='w-full py-4 flex flex-col items-center justify-center gap-2'>
                                <p className='text-color-60 text-sm font-semibold'>No pending verification request</p>
                            </div>
                        )}
                    </div>
                )}


                {status === 'approved' && (
                    <div className='w-full min-w-[400px] mx-auto'>
                        {approvedDocuments.length > 0 ? (
                            <>
                                {approvedDocuments.map(item => {
                                    return (
                                        <div 
                                            key={item.doc.$id}
                                            className='bg-white drop-shadow-md rounded-md mb-3 px-3 py-2 border border-gray-200 hover:bg-gray-50 hover:border-color-10 hover:border'
                                        >
                                            <div className='flex items-center justify-between'>
                                                <p className='text-sm text-color-60 font-semibold'>Verification Type</p>

                                                <p 
                                                    className='text-xs text-gray-400 hover:text-color-10 hover:underline cursor-pointer'
                                                    onClick={() => setShowDetails(item)}
                                                >Show details</p>

                                                <p className='text-xs text-gray-400'>
                                                    {
                                                        item.doc.type === 'National ID' ? 'Identity verification'
                                                        : item.doc.type === 'Driving licence' ? 'Identity verification'
                                                            : item.doc.type === 'Utility bill' ? 'Address verification'
                                                                : item.doc.type === 'Bank statement' ? 'Address verification'
                                                                    : item.doc.type === 'Card statement' ? 'Address verification'
                                                                        : item.doc.type === 'Resident permit' ? 'Address verification'
                                                                            : ''
                                                    }
                                                </p>
                                            </div>

                                            <div className='flex items-center justify-between border-t border-gray-300 py-3'>
                                                <div>
                                                    <p className='text-xs text-gray-400 font-medium mb-1'>Document Type</p>
                                                    <p className='text-[10px] text-color-60'>{item.doc.type}</p>
                                                </div>

                                                <div>
                                                    <p className='text-xs text-gray-400 font-medium mb-1'>Account name</p>
                                                    <p className='text-[10px] text-color-60'>{item.user.firstname} {item.user.lastname}</p>
                                                </div>
                                                
                                                <p className='flex flex-col gap-2 text-xs'>
                                                    <span className='font-semibold text-gray-400'>
                                                        Status
                                                    </span>

                                                    {['National ID', 'Driving licence'].includes(item.doc.type) && (
                                                        <span 
                                                            className='text-[10px] flex items-center gap-1 drop-shadow-md rounded-full pl-2 pr-3 text-green-400 bg-green-200'
                                                        >
                                                            <Image
                                                                src='/green-dot-icon.svg'
                                                                width={10}
                                                                height={10}
                                                                alt='approved verification icon'
                                                            />
                                                            Approved
                                                        </span>
                                                    )}


                                                    {['Utility bill', 'Bank statement', 'Card statement', 'Resident permit'].includes(item.doc.type) && (
                                                        <span 
                                                            className='text-[10px] flex items-center gap-1 drop-shadow-md rounded-full pl-2 pr-3 text-green-400 bg-green-200'
                                                        >
                                                            <Image
                                                                src='/green-dot-icon.svg'
                                                                width={10}
                                                                height={10}
                                                                alt='pending or approved verification icon'
                                                            />
                                                            Approved
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        ) : verificationDocumentsLoading ? (
                            <div className="w-full animate-pulse flex flex-col gap-1">
                                <div className='w-full h-16 bg-gray-300'></div>
                                <div className='w-full h-16 bg-gray-300'></div>
                                <div className='w-full h-16 bg-gray-300'></div>
                            </div>
                        ) : (
                            <div className='w-full py-4 flex flex-col items-center justify-center gap-2'>
                                <p className='text-color-60 text-sm font-semibold'>No approved identity and address verifications</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {typeof showDetails === 'object' && (
                <KYCLogDetails logDetails={showDetails} setLogDetails={setShowDetails} />
            )}
        </main>
    )
}

export default KYCVerification