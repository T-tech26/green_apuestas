'use client'
import React, { useState } from 'react'
import Image from "next/image";
import { useUser } from '@/contexts/child_context/userContext';
import { UserData } from '@/types/globals';
import ProfileMobleMenu from './ProfileMobleMenu';
import { useOtherContext } from '@/contexts/child_context/otherContext';
import Notifications from './Notifications';
import { formatAmount } from '@/lib/utils';

const ProfileHeader = () => {

    const { user } = useUser();
    const { userNotifications } = useOtherContext();
    
    const [showNotification, setShowNotification] = useState(false);

    return (
        <>
            {typeof user === 'object' ? (
                <div className="flex items-center justify-between md:justify-end w-full px-5 py-1 bg-white drop-shadow-md">
                    <ProfileMobleMenu />
                    
                    <div className="flex items-center py-1 px-3 rounded-md gap-5">
                        <Image
                            src='/profile-icon.svg'
                            width={40}
                            height={40}
                            alt='profile icon'
                        />

                        <div>
                            <p className='text-color-60 text-sm'>{`${(user as UserData)?.lastname} ${(user as UserData)?.firstname}`}</p>
                            <p className='text-color-60 text-xs tracking-wide'>{`${formatAmount((user as UserData)?.balance)}`} USD</p>
                        </div>

                        <div className='relative cursor-pointer' onClick={() => setShowNotification(true)}>
                            <Image
                                src='/notifications-icon.svg'
                                width={30}
                                height={30}
                                alt='notifications icon'
                                onClick={() => setShowNotification(true)}
                            />

                            <span className='text-color-30 text-xs absolute top-[-5px] right-0 bg-color-10 px-1 rounded-full z-50'>
                                {userNotifications.length > 0 && (
                                    <span className='absolute top-0 -right-[3px] bg-color-10 rounded-full size-5 -z-50 animate-ping'></span>
                                )}
                                {userNotifications.length}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-pulse flex items-center h-[56px] justify-between md:justify-end w-full px-5 py-1 bg-white drop-shadow-md">
                    <div className='w-10 h-9 md:hidden bg-gray-300 rounded-md'></div>

                    <div className='w-64 h-9 bg-gray-300 rounded-md'></div>
                </div>
            )}

            {showNotification && (
                <Notifications setShow={setShowNotification} type='user' />
            )}
        </>
    )
}

export default ProfileHeader