'use client'
import React from 'react'
import Image from 'next/image'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Link from 'next/link'
import { Button } from './ui/button'
import { logOut } from '@/lib/actions/userActions'
import { usePathname } from 'next/navigation'
import { ProfileMenuLinks } from '@/constants'
import { cn } from '@/lib/utils'

const ProfileMobleMenu = () => {

    const pathName = usePathname();

    const handleLogOut = async () => {
        const response = await logOut();

        if(response === 'success') {
            window.location.reload();
        }
    }
    

    return (
        <section className='md:hidden'>
            <Sheet>
                <SheetTrigger>
                    <div className='bg-white border border-l-0 border-color-30 rounded-tr-lg rounded-br-lg'>
                        <Image
                            className="cursor-pointer"
                            src='/menu-right-icon.svg'
                            alt="mobile nav icon"
                            width={38}
                            height={38}
                        />
                    </div>
                </SheetTrigger>

                <SheetContent
                    side='left'
                    className='bg-dark-gradient-135deg flex flex-col justify-between item-center pb-7 py-5 overflow-y-scroll'
                >
                    <Image
                        src='/logo-light.png'
                        width={100}
                        height={100}
                        alt='light version logo'
                    />

                    <div className='hidden'>
                        <SheetHeader>
                            <SheetTitle></SheetTitle>
                            <SheetDescription></SheetDescription>
                        </SheetHeader>
                    </div>

                    <div className='w-full flex-1'>
                        {ProfileMenuLinks.map((link) => {

                            const isActive = pathName === link.route || pathName.startsWith(`&{link.route}/`);

                            return (
                                <SheetClose asChild key={link.name}>
                                    <Link
                                        href={link.route}
                                        className={cn('profile-link flex gap-2 items-center text-color-30 text-sm', { 'bg-light-gradient-135deg' : isActive })}
                                    >
                                        <Image
                                            src={link.icon}
                                            width={20}
                                            height={20}
                                            alt='icons'
                                            className='cursor-pointer'
                                        />
                                        {link.name}
                                    </Link>
                                </SheetClose>
                            )
                        })}
                    </div>
                
                    <SheetClose asChild>
                        <Button
                            className='w-full bg-transparent rounded-none border-t-2 border-color-10 hover:bg-light-gradient-135deg cursor-pointer flex gap-2 items-center text-sm'
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
                    </SheetClose>
                </SheetContent>

            </Sheet>
        </section>
    )
}

export default ProfileMobleMenu