'use client'
import { AdminMainMenuLinks, AdminSubMenuLinks } from '@/constants';
import { logOut } from '@/lib/actions/userActions';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import Image from 'next/image';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const AdminMenu = () => {
  
  
    const pathName = usePathname();

    const handleLogOut = async () => {
        const response = await logOut();

        if(response === 'success') {
            window.location.reload();
        }
    }

    return (
        <aside
            className='md:relative hidden md:flex bg-dark-gradient-135deg h-screen w-64 lg:w-72 flex-col item-center pt-5 pb-5 px-7 overflow-y-scroll'
        >
            <Image
                src='/logo-light.png'
                width={100}
                height={100}
                alt='light version logo'
                className='mb-5'
            />

            {AdminMainMenuLinks.map((link) => {

                const isActive = pathName === link.route || pathName.startsWith(`&{link.route}/`);

                return (
                    <Link
                        key={link.name}
                        href={link.route}
                        className={cn('admin-link', { 'bg-light-gradient-135deg' : isActive })}
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

            {AdminSubMenuLinks.map((link) => {
                return (
                    <div  key={link.title} className='py-3'>
                        <p
                            className='text-gray-400 text-sm font-semibold'
                        >
                            {link.title}
                        </p>

                        {link.routes.map((route) => {

                            const isActive = pathName === route.route || pathName.startsWith(`&{link.route}/`);

                            return (
                                <Link
                                    key={route.name}
                                    href={route.route}
                                    className={cn('admin-link', { 'bg-light-gradient-135deg' : isActive })}
                                >
                                    <Image
                                        src={route.icon}
                                        width={20}
                                        height={20}
                                        alt='menu icons'
                                        className='cursor-pointer'
                                    />
                                    {route.name}
                                </Link> 
                            )
                        })}
                    </div>
                )
            })}

            <div className='h-16'>
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

export default AdminMenu