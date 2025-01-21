'use client'
import React, { useEffect, useState } from 'react'
import AdminMobleMenu from './AdminMobleMenu'
import Image from 'next/image'
import { useUser } from '@/contexts/child_context/userContext';
import Notifications from './Notifications';
import { useNotificationContext } from '@/contexts/child_context/notificationContext';
import { Admin } from '@/types/globals';
import ProfileImageForm from './ProfileImageForm';

const AdminHeader = () => {

    const { admin } = useUser();
    const { adminNotifications, getAlladminNotification } = useNotificationContext();

    const [showNotification, setShowNotification] = useState(false);
    const [profile, setProfile] = useState(false);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if(!adminNotifications.length) {
            getAlladminNotification();
        }
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */


    return (
        <div>
            {typeof admin === 'object' ? (
                <div className="flex items-center justify-between md:justify-end w-full px-5 py-1 bg-white drop-shadow-md">
                    <AdminMobleMenu />
                    
                    <div className="flex items-center py-1 px-3 rounded-md gap-4">
                        {(admin as Admin).adminImg !== '' ? (
                            /* eslint-disable @next/next/no-img-element */
                            <img
                                src={(admin as Admin).adminImg ? (admin as Admin).adminImg : ''}
                                width={40}
                                height={40}
                                alt='profile image'
                                className='rounded-full cursor-pointer size-10'
                                onClick={() => setProfile(!profile)}
                            />
                            /* eslint-enable @next/next/no-img-element */
                        ) : (
                            <Image
                                src='/profile-icon.svg'
                                width={40}
                                height={40}
                                alt='profile icon'
                                className='cursor-pointer'
                                onClick={() => setProfile(!profile)}
                            />
                        )}

                        <p className='text-color-60 text-sm'>Welcome, {admin.name}</p>

                        <div className='relative cursor-pointer' onClick={() => setShowNotification(true)}>
                            <Image
                                src='/notifications-icon.svg'
                                width={30}
                                height={30}
                                alt='notifications icon'
                                onClick={() => setShowNotification(true)}
                            />

                            {adminNotifications.length > 0 && (
                                <span className='text-color-30 text-xs absolute top-[-5px] right-0 bg-color-10 px-1 rounded-full z-50'>
                                    <span className='absolute top-0 -right-[3px] bg-color-10 rounded-full size-5 -z-50 animate-ping'></span>
                                    {adminNotifications.length}
                                </span>
                            )}
                            
                            {adminNotifications.length === 0 && (
                                <span className='text-color-30 text-xs absolute top-[-5px] right-0 bg-color-10 px-1 rounded-full z-50'>
                                    {adminNotifications.length}
                                </span>
                            )}
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
                <Notifications setShow={setShowNotification} type='admin' />
            )}

            {profile === true && (
                <ProfileImageForm setProfile={setProfile} type='admin' />
            )}  
        </div>
    )
}

export default AdminHeader