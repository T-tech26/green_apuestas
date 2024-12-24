import React from 'react'
import Link from 'next/link'
import { menuLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const MobileNav = () => {

    const pathName = usePathname();

    return (
        <section className='md:hidden'>
            <Sheet>
                <SheetTrigger>
                    <Image
                        className="cursor-pointer"
                        src='/menu.svg'
                        alt="mobile nav icon"
                        width={38}
                        height={38}
                    />
                </SheetTrigger>

                <SheetContent
                    side='right'
                    className='bg-dark-gradient-135deg flex flex-col justify-center items-center text-color-30'
                >
                    <SheetClose>
                        <nav
                            className='flex flex-col px-28'
                        >
                            {menuLinks.map((item) => {
                                
                                const isActive = pathName === item.route || pathName.startsWith(`&{item.route}/`);

                                return(
                                    <SheetClose asChild
                                        key={item.label}
                                    >
                                        <Link
                                            href={item.route}
                                            key={item.label}
                                            className={cn('mobileNav', { 'border-b-2 border-b-color-10' : isActive })}
                                        >
                                            {item.label}
                                        </Link>
                                    </SheetClose>
                                )
                            })}
                        </nav>
                    </SheetClose>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNav