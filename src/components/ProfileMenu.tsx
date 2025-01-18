'use client'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { logOut } from '@/lib/actions/userActions'
import { ProfileMenuLinks } from '@/constants'
import { cn } from '@/lib/utils'

const ProfileMenu = () => {

    const pathName = usePathname();

    const handleLogOut = async () => {
        const response = await logOut();

        if(response === 'success') {
            window.location.reload();
        }
    }

    return (
        <aside
            className='hidden md:flex bg-dark-gradient-135deg h-screen w-64 lg:w-72 flex-col justify-center item-center pt-5 pb-5 px-7'
        >
            <Link href='/'>
                <Image
                    src='/logo-light.png'
                    width={100}
                    height={100}
                    alt='light version logo'
                    className='mb-5'
                />
            </Link>

            {ProfileMenuLinks.map((link) => {

                const isActive = pathName === link.route || pathName.startsWith(`&{link.route}/`);

                return (
                    <Link
                        key={link.name}
                        href={link.route}
                        className={cn('profile-link flex gap-2 items-center text-color-30 text-sm', { 'bg-light-gradient-135deg' : isActive })}
                    >
                        <Image
                            src={link.icon}
                            width={20}
                            height={20}
                            alt='menu icons'
                            className='cursor-pointer'
                        />
                        {link.name}
                    </Link>
                )
            })}

            <div className='flex-1'>
            </div>

            <Button
                className='bg-transparent rounded-none border-t-2 border-color-10 hover:bg-light-gradient-135deg cursor-pointer flex gap-2 items-center text-sm'
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
            </Button>
        </aside>
    )
}

export default ProfileMenu