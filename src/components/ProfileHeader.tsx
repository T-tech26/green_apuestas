import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { getLoggedInUser } from '@/lib/actions/userActions';
import { useUser } from '@/contexts/child_context/userContext';
import { UserData } from '@/types/globals';
import ProfileMobleMenu from './ProfileMobleMenu';

const ProfileHeader = () => {

    const { user, setUser } = useUser();
    
    useEffect(() => {
        const login = async () => {
            const response = await getLoggedInUser();

            if(typeof response === 'object') setUser(response);
        }

        login();
    }, [user]);

    return (
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
                    <p className='text-color-60 text-xs tracking-wide'>{`${(user as UserData)?.balance}`} USD</p>
                </div>

                <div className='relative'>
                    <Image
                        src='/notifications-icon.svg'
                        width={30}
                        height={30}
                        alt='notifications icon'
                    />

                    <span className='text-color-60 text-xs absolute top-[-5px] right-0'>
                        0
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader