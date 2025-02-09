import React, { useState } from 'react'
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logOut } from '@/lib/actions/userActions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/child_context/userContext';
import { ProfileMenuLinks } from '@/constants';
import { UserData } from '@/types/globals';
import { formatAmount } from '@/lib/utils';
import ProfileImageForm from './ProfileImageForm';
import TopWinners from './TopWinners';
  

const Header = () => {

    const { user, setUser } = useUser();    

    const [profile, setProfile] = useState(false);

    
    const handleLogOut = async () => {
        const response = await logOut();

        if(response === 'success') {
            setUser('');
            return redirect('/signin');
        }
    }



    return (
        <div className="header">
            <div className="md:hidden">
                <TopWinners />
            </div>

            <div className="flex justify-between items-center gap-5">

                <Link href='/'>
                    <Image
                        src='/logo-light.png'
                        width={100}
                        height={100}
                        alt='light version logo'
                        className='w-[100px] h-[50px]'
                    />
                </Link>              

                <div className="md:flex flex-1 items-center gap-2 hidden">
                    <TopWinners />
                </div>
            
                <div className="flex justify-between items-center gap-3">
                    <div
                        className='flex gap-3 justify-between items-center max:w-52'
                    >

                        {(user as UserData).profileImg !== null ? (
                            /* eslint-disable @next/next/no-img-element */
                            <img
                                src={(user as UserData).profileImgUrl ? (user as UserData).profileImgUrl : ''}
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

                        <div>
                            <p className='text-color-30 text-sm' translate='no'>{(user as UserData).firstname} {(user as UserData).lastname}</p>
                            <p className='text-color-30 text-xs' translate='no'>{formatAmount((user as UserData).balance)} USD</p>
                        </div>

                        <div
                            className='relative flex justify-center items-center bg-light-gradient-135deg border-[1px] border-color-30 rounded-md cursor-pointer'
                        >
                            <DropdownMenu>
                                <DropdownMenuTrigger 
                                    className='outline-none border-none focus:outline-none focus:border-none'
                                >
                                    <Image
                                        src='/arrow_drop_down.svg'
                                        width={30}
                                        height={30}
                                        alt='profile menu'
                                        className='cursor-pointer'
                                    />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent  className='bg-dark-gradient-135deg h-auto flex flex-col justify-center text-color-30 absolute right-0 top-5 w-52'>

                                    <div
                                        className='flex items-center pl-4 gap-2 py-3 w-full bg-light-gradient-135deg'
                                    >
                                        {(user as UserData).profileImg !== null ? (
                                            /* eslint-disable @next/next/no-img-element */
                                            <img
                                                src={(user as UserData).profileImgUrl ? (user as UserData).profileImgUrl : ''}
                                                width={40}
                                                height={40}
                                                alt='profile image'
                                                className='rounded-full size-10'
                                            />
                                            /* eslint-enable @next/next/no-img-element */
                                        ) : (
                                            <Image
                                                src='/profile-icon.svg'
                                                width={40}
                                                height={40}
                                                alt='profile icon'
                                            />
                                        )}

                                        <div>
                                            <p className='text-color-30 text-sm' translate='no'>{(user as UserData).firstname} {(user as UserData).lastname}</p>
                                        </div>
                                    </div>

                                    {ProfileMenuLinks.map(link => {
                                        return (
                                            <DropdownMenuItem 
                                                key={link.name}
                                                className='px-5 py-3 border-b-2 border-color-10 hover:bg-light-gradient-135deg cursor-pointer'
                                            >
                                                <Link
                                                    href={link.route}
                                                    className='flex gap-2 items-center'
                                                >
                                                    <Image
                                                        src={link.icon}
                                                        width={20}
                                                        height={20}
                                                        alt='personal profile icon'
                                                        className='cursor-pointer'
                                                    />
                                                    {link.name}
                                                </Link>
                                            </DropdownMenuItem>
                                        )
                                    })}

                                    <div className='h-20'></div>

                                    <DropdownMenuItem 
                                        className='px-5 py-3 border-t-2 border-color-10 hover:bg-light-gradient-135deg cursor-pointer flex gap-2 items-center'
                                        onClick={() => handleLogOut()}
                                    >
                                        <Image
                                            src='/logout.svg'
                                            width={20}
                                            height={20}
                                            alt='logout icon'
                                            className='cursor-pointer'
                                        />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                    </div>
                </div>
            </div>
            {profile === true && (
                <ProfileImageForm setProfile={setProfile} type='user' />
            )}
        </div>
    )
}

export default Header