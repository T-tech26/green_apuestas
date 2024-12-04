'use client'
import React from 'react'
import AdminMobleMenu from './AdminMobleMenu'
import Image from 'next/image'
import { useUser } from '@/contexts/child_context/userContext';
import { UserData } from '@/types/globals';

const AdminHeader = () => {

    const { user } = useUser();

    return (
        <>
            {typeof user === 'object' ? (
                <div className="flex items-center justify-between md:justify-end w-full px-5 py-1 bg-white drop-shadow-md">
                    <AdminMobleMenu />
                    
                    <div className="flex items-center py-1 px-3 rounded-md gap-4">
                        <Image
                            src='/profile-icon.svg'
                            width={40}
                            height={40}
                            alt='profile icon'
                        />

                        <p className='text-color-60 text-sm'>Welcome, {`${(user as UserData)?.lastname} ${(user as UserData)?.firstname}`}</p>

                        <div className='relative'>
                            <Image
                                src='/notifications-icon.svg'
                                width={30}
                                height={30}
                                alt='notifications icon'
                            />

                            <span className='text-color-30 text-xs absolute top-[-5px] right-0 bg-color-10 px-1 rounded-full'>
                                0
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
        </>
    )
}

export default AdminHeader