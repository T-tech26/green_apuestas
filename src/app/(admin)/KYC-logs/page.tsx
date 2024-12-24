'use client'
import { useUser } from '@/contexts/child_context/userContext';
import { UserData, VerificationDocument } from '@/types/globals';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import KYCLogDetails from '@/components/KYCLogDetails';
import { approveDocumentVerification, getUserNotification, getVerificationDocuments, userNotification } from '@/lib/actions/userActions';
import { toast } from '@/hooks/use-toast';
import { generateDateString, verificationDocumentWithImages } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useUserSlipContext } from '@/contexts/child_context/userSlipContext';
import { useNotificationContext } from '@/contexts/child_context/notificationContext';



interface DocWithUser {
    doc: VerificationDocument,
    user: UserData
}



const KYCLogs = () => {


    const { allUsers } = useUser();
    const { verificationDocuments, setVerificaitonDocuments } = useUserSlipContext();
    const { setUserNotifications } = useNotificationContext();

    const [pendingDocuments, setPendingDocuments] = useState<DocWithUser[]>([]);
    const [showDetails, setShowDetails] = useState<DocWithUser | string>('');
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState('');



    useEffect(() => {
        if(verificationDocuments.length > 0) {
            const userWithIdDocument: DocWithUser[] = verificationDocuments.map((doc: VerificationDocument) => {

                const user = (allUsers as UserData[]).find(user => user.userId === doc.userId);
                
                if(user) {
                    return {
                        doc,
                        user
                    }
                }

                return null;
            }).filter((item): item is DocWithUser => item !== null);

            const pending = userWithIdDocument.filter(doc => doc.doc.ID_verification === false && doc.doc.address_verification === false);

            setPendingDocuments(pending);
        }
    }, [verificationDocuments, allUsers]);



    const handleStatus = async (id: string, type: string, action: string, userId: string) => {
        const date = generateDateString();

        setLoading(true);
        try {
            const status = await approveDocumentVerification(id, type, action, userId);

            if(status !== 'success') {
                
                toast({
                    description: status
                })
                return;
            }

            toast({
                description: `User verification ${action === 'approve' ? 'approved' : 'rejected'}`
            });


            const response = await getVerificationDocuments();
            if(typeof response === 'string') return;
            const documents = verificationDocumentWithImages(response);
            setVerificaitonDocuments(documents);


            const notificationType = ['National ID', 'Driving licence'].includes(type) ? 'Identity verification'
                                        : ['Utility bill', 'Bank statement', 'Card statement', 'Resident permit'].includes(type) ? 'Address verification' : '';
            const actionType = action === 'approve' ? 'approved' : `${action}ed`;


            const notification = await userNotification(userId, `${notificationType} and ${actionType}`, date, '');
            if(notification !== 'success') return;

            const getNotification = await getUserNotification();
            if(typeof getNotification === 'string') return;
            setUserNotifications(getNotification);

        } catch(error) {
            console.error('Error handling the document status', error);
        } finally {
            setLoading(false);
        }
    }



    return (
        <main className='flex-1 py-14 overflow-x-hidden overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-10'>
                <h1 className='text-lg text-color-60 font-medium'>KYC LOGS</h1>

                <div className='w-full mx-auto flex flex-col gap-1'>
                    {pendingDocuments.length > 0 ? (
                        <>
                            {pendingDocuments.map(item => {
                                return (
                                    <div
                                        key={item.doc.$id}
                                        className='bg-white drop-shadow-md rounded-md px-3 py-2 border border-gray-200 hover:bg-gray-50 hover:border-color-10 hover:border'
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


                                            <div className='flex flex-col gap-1 items-center'>
                                                <p className='text-xs text-gray-400 font-medium'>Status</p>
                                                <p 
                                                    className='text-[10px] flex items-center gap-1 drop-shadow-md rounded-full pl-2 pr-3 text-red-400 bg-red-200'
                                                >
                                                    <Image
                                                        src='/red-dot-icon.svg'
                                                        width={10}
                                                        height={10}
                                                        alt='pending transaction icon'
                                                    />
                                                    Pending
                                                </p>
                                            </div>

                                            <div className='flex flex-col md:flex-row items-center gap-2'>
                                                <Button 
                                                    disabled={loading && loadingId === `${item.doc.$id!} approve`}
                                                    type='button'
                                                    className='w-20 h-6 text-xs text-color-30 bg-light-gradient-135deg px-0 py-0 rounded-full focus:outline-none'
                                                    onClick={() => {
                                                        handleStatus(item.doc.$id!, item.doc.type, 'approve', item.user.userId);
                                                        setLoadingId(`${item.doc.$id!} approve`);
                                                    }}
                                                >
                                                    {loading && loadingId === `${item.doc.$id!} approve` ? (
                                                        <>
                                                            <Loader2 size={20} className='animate-spin'/>&nbsp; 
                                                            Loading...
                                                        </>
                                                    ) : 'Approve'}
                                                </Button>

                                                <Button 
                                                    disabled={loading && loadingId === `${item.doc.$id!} reject`}
                                                    type='button'
                                                    className='w-20 h-6 text-xs text-color-30 bg-light-gradient-135deg px-0 py-0 rounded-full focus:outline-none'
                                                    onClick={() => {
                                                        handleStatus(item.doc.$id!, item.doc.type, 'reject', item.user.userId);
                                                        setLoadingId(`${item.doc.$id!} reject`);
                                                    }}
                                                >
                                                    {loading && loadingId === `${item.doc.$id!} reject` ? (
                                                        <>
                                                            <Loader2 size={20} className='animate-spin'/>&nbsp; 
                                                            Loading...
                                                        </>
                                                    ) : 'Reject'}
                                                </Button>
                                            </div>                                                            
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                    ) : (
                        <div className='w-full py-4 flex flex-col items-center justify-center gap-2'>
                            <p className='text-color-60 text-sm font-semibold'>No user uploaded document for verification</p>
                        </div>
                    )}
                </div>
            </div>

            {typeof showDetails === 'object' && (
                <KYCLogDetails logDetails={showDetails} setLogDetails={setShowDetails} />
            )}
        </main>
    )
}

export default KYCLogs