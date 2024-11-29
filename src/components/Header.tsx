import React, { useEffect } from 'react'
import MobileNav from './MobileNav';
import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';
import { menuLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { getLoggedInUser } from '@/lib/actions/userActions';
import LoggedInHeader from './LoggedInHeader';
import { useUser } from '@/contexts/child_context/userContext';
import { UserData } from '@/types/globals';

const Header = () => {

    const { user, setUser } = useUser();

    const pathName = usePathname();


    useEffect(() => {
        const getLogin = async () => {
            const response = await getLoggedInUser();

            if(typeof response === 'object') setUser(response);
        }

        getLogin();
    }, []);



    return (
        <>
            {user ? (
                <LoggedInHeader 
                    name={
                        `${(user as UserData)?.lastname} ${(user as UserData)?.firstname}`
                    }
                    balance={`${(user as UserData)?.balance}`}
                />
            ) : (
                <div className="header">
                    <div className="md:hidden flex items-center justify-between">
                        <div className="flex items-center">
                            <h3 className="font-medium text-color-30 tracking-wide pr-2">
                            Top winners
                            </h3>
                            <p className="font-light text-xs text-color-30 tracking-wide border-l pl-2">
                            ArthurMic won $700,000
                            </p>
                        </div>

                        <LanguageSwitcher />
                    </div>

                    <div className="flex justify-between items-center">
                    <h1 className="text-2xl text-color-30 font">Logo</h1>
                    
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