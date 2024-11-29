import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { redirect, usePathname } from 'next/navigation'
import { logOut } from '@/lib/actions/userActions'
import { ProfileMenuLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { useUser } from '@/contexts/child_context/userContext'

const ProfileMenu = () => {

    const pathName = usePathname();

    const { setUser } = useUser();

    const handleLogOut = async () => {
        const response = await logOut();

        if(response === 'success') {
            setUser('');
            return redirect('/signin');
        }
    }

    return (
        <aside
            className='hidden md:flex bg-dark-gradient-135deg h-screen w-64 lg:w-72 flex-col justify-center item-center pt-20 pb-5 px-7'
        >
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