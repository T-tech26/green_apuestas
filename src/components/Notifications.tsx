'use client'
import { deleteAdminNotification, deleteUserNotification, getAdminNotification, getUserNotification } from '@/lib/actions/userActions'
import { UserData, Notifications as AdminNotifications } from '@/types/globals'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useUser } from '@/contexts/child_context/userContext'
import { formatAmount } from '@/lib/utils'
import { useNotificationContext } from '@/contexts/child_context/notificationContext'

interface NotificationsProps {
    setShow: (newShow: boolean) => void,
    type: string,
}


interface UserWithNotify {
    not: AdminNotifications,
    user: UserData,
}


const Notifications = ({ setShow, type }: NotificationsProps) => {


    const { user, allUsers } = useUser();
    const { userNotifications, setUserNotifications, adminNotifications, setAdminNotifications } = useNotificationContext();

    const [userWithNotification, setUserWithNotification] = useState<AdminNotifications[]>([]);
    const [adminWithNotification, setAdminWithNotification] = useState<UserWithNotify[]>([]);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if(userNotifications.length > 0) {
            const mappedUserWithNotification: AdminNotifications[] = userNotifications.filter(notify => notify.userId === (user as UserData).userId)

            setUserWithNotification(mappedUserWithNotification.reverse());   
        }
    }, [userNotifications]);
    

    
    useEffect(() => {
        if (adminNotifications.length > 0 && Array.isArray(allUsers)) {

            const mappedUserWithNotify: UserWithNotify[] = adminNotifications.map((not: AdminNotifications) => {
                
                const user = (allUsers as UserData[]).find(user => user.userId === not.userId);
        
                if (user) {
                    // Return an object with both slip and user properties
                    return {
                        not,  // `slip` will be added as a property
                        user   // `user` will be added as a property
                    };
                }
        
                // If no matching user is found, you can return an empty object or handle it as needed
                // But it should return an object of type `UserWithSlip`
                return null;
            }).filter((item): item is UserWithNotify => item !== null); // Type guard to filter out `null` values

            // Update the state with the userWithSlip data
            setAdminWithNotification(mappedUserWithNotify.reverse());
        }
    }, [adminNotifications, allUsers]);
    /* eslint-enable react-hooks/exhaustive-deps */



    const handleDeleteUseNotifications = async (id: string | undefined) => {
        try {

            if(id === undefined) return;

            await deleteUserNotification(id);

            const notifications = await getUserNotification();
            if(typeof notifications === 'string') return;
            setUserNotifications(notifications);

            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (error: any) {
            /* eslint-enable @typescript-eslint/no-explicit-any */
            console.error("Error deleting notification", error);
        }
    }



    const handleDeleteAdminNotification = async (id: string | undefined) => {
        try {

            if(id === undefined) return;

            await deleteAdminNotification(id);

            const notifications = await getAdminNotification();
            if(typeof notifications === 'string') return;
            setAdminNotifications(notifications);

            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (error: any) {
            /* eslint-enable @typescript-eslint/no-explicit-any */
            console.error("Error deleting notification", error);
        }
    }



    return (
        <main className='fixed top-0 right-0 left-0 bottom-0 bg-color-60 bg-opacity-30 overflow-y-scroll grid place-items-center py-14 z-50'>
            <div className='w-4/5 bg-color-30 rounded-md py-3 relative'>
                <Image 
                    src='/close.svg'
                    width={25}
                    height={25}
                    alt='Close icon'
                    className='absolute -top-[30px] -right-[10px] cursor-pointer'
                    onClick={() => setShow(false)}
                />

                {adminWithNotification.length > 0 && type === 'admin' && (
                    <>
                        {adminWithNotification.map((not, index) => {
                            return (
                                <p 
                                    key={not.not.$id}
                                    className={`text-color-60 text-sm px-5 py-2 bg-gray-100 border-b border-gray-300 relative flex flex-col justify-between ${
                                        index === 0 ? 'border-t' : ''
                                    }`}
                                >
                                    {
                                        not.not.type === 'deposit' ? `${not.user.firstname} ${not.user.lastname} made a deposit of ${not.not.amount && formatAmount(not.not.amount)} USD`
                                            : not.not.type === 'withdrawal' ? `${not.user.firstname} ${not.user.lastname} just made a withdrawal request of ${not.not.amount && formatAmount(not.not.amount)} USD.`
                                                : ['National ID', 'Driving licence'].includes(not.not.type) ? `${not.user.firstname} ${not.user.lastname} just uploaded identity verification documents, with type ${not.not.type}` 
                                                    : ['Utility bill', 'Bank statement', 'Card statement', 'Resident permit'].includes(not.not.type) ? `${not.user.firstname} ${not.user.lastname} just uploaded address verification documents, with type ${not.not.type}`
                                                        : ''
                                    }
                                    <span className='text-gray-400 text-xs'>{not.not.date}</span>
                                    <span 
                                        className='text-gray-400 text-[11px] absolute bottom-0 right-3 cursor-pointer hover:text-color-10 hover:underline'
                                        onClick={() => handleDeleteAdminNotification((not.not.$id as string))}
                                    >mark as read</span>
                                </p>
                            )
                        })}
                    </>
                )}

                {userWithNotification.length > 0 && type === 'user' && (
                    <>
                        {userWithNotification.map((not, index) => {
                            return (
                                <p 
                                    key={not.$id}
                                    className={`text-color-60 text-sm px-5 py-2 bg-gray-100 border-b border-gray-300 relative flex flex-col justify-between ${
                                        index === 0 ? 'border-t' : ''
                                    }`}
                                >
                                    {
                                        not.type === 'deposit approved' ? `Your deposit of ${not.amount && formatAmount(not.amount)} USD has been approved, and your account has been credited with ${not.amount && formatAmount(not.amount)} USD.`
                                            : not.type === 'deposit rejected' ? `Your deposit of ${not.amount && formatAmount(not.amount)} USD has been rejected.`
                                                : not.type === 'stake' ? 'Green apuesta team has just booked a ticket for you.'
                                                    : not.type === 'deduct' ? `${not.amount && formatAmount(not.amount)} USD has been deducted from your account for your ticket.`
                                                        : not.type === 'ticketWon' ? `You have been credited with ${not.amount && formatAmount(not.amount)} USD from your winning ticket.`
                                                            : not.type === 'Identity verification and approved' ? 'Your identity verification has been approved.'
                                                                : not.type === 'Address verification and approved' ? 'Your address verification has been approved.'
                                                                    : not.type === 'Identity verification and rejected' ? 'Your identity verification has been rejected.' 
                                                                        : not.type === 'Address verification and rejected' ? 'Your address verification has been rejected.' 
                                                                            : not.type === 'withdrawal rejected' ? 'Your withdrawal request was rejected.' 
                                                                                : not.type === 'withdrawal approved' ? 'Your withdrawal request has been approved and funds have been transfered to your bank.' 
                                                                                    : ''
                                    }
                                    <span className='text-gray-400 text-xs'>{not.date}</span>
                                    <span 
                                        className='text-gray-400 text-[11px] absolute bottom-0 right-3 cursor-pointer hover:text-color-10 hover:underline'
                                        onClick={() => handleDeleteUseNotifications(not.$id)}
                                    >mark as read</span>
                                </p>
                            )
                        })}
                    </>
                )}
            </div>
        </main>
    )
}

export default Notifications