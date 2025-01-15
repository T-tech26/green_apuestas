'use client'
import React, { useState } from 'react'
import MobileNav from './MobileNav';
import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';
import { DisplayNames, menuLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import LoggedInHeader from './LoggedInHeader';
import { useUser } from '@/contexts/child_context/userContext';
import Image from 'next/image';



const Header = () => {

    const { user } = useUser();

    const pathName = usePathname();
    
    const [nameIndex, setNameIndex] = useState(0);
    const [slideName, setSlideName] = useState(false);
    const [slideStyle, setSlideStyle] = useState('slideOut');


    setInterval(() => {
        if(!slideName) {
            setSlideStyle('slideIn');
            const index = Math.floor(Math.random() * 50);
            setNameIndex(index);

            setTimeout(() => {
                setSlideName(!slideName);
                setSlideStyle('slideOut')
            }, 1000);
        }
    }, 7000);
    

    return (
        <>
            {typeof user === 'object' ? (
                <LoggedInHeader />
            ) : (
                <div className="header">
                    <div className="md:hidden flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                           <h3 className="font-medium text-xs text-color-30 border-r tracking-wide pr-2 italic text-wrap w-12 md:w-auto">
                                Top winners
                            </h3>
                            <p className="font-light text-[10px] leading-[14px] text-color-30 tracking-wide italic relative overflow-hidden flex-1 h-4">
                                <span className={`absolute left-0 bg-color-60 ${slideStyle}`}>
                                    {DisplayNames[nameIndex].text}
                                </span>
                            </p>
                        </div>

                        <LanguageSwitcher />
                    </div>

                    <div className="flex justify-between items-center">
                    
                    <Image
                        src='/logo-light.png'
                        width={100}
                        height={100}
                        alt='light version logo'
                    />
                    
                    <div className="hidden md:flex justify-center items-center gap-5">
                        {menuLinks.map((item) => {
                        
                        const isActive = pathName === item.route || pathName.startsWith(`&{item.route}/`);

                        return(
                            <Link
                            href={item.route}
                            key={item.label}
                            className={ isActive ? `activeMenu` : `menu` }
                            >
                            {item.label}
                            </Link>
                        )
                        })}
                    </div>

                    <div className="flex justify-between items-center gap-3">

                        <div className="md:flex justify-between gap-1 items-center hidden">
                        <LanguageSwitcher />
                        </div>

                        <Link href='/signin' className="loginbtn">Login</Link>
                        <Link href='/register' className="registerbtn">Register</Link>

                        <MobileNav />
                    </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header