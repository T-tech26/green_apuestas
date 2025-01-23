'use client'
import MobileNav from './MobileNav';
import Link from 'next/link';
import { menuLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import LoggedInHeader from './LoggedInHeader';
import { useUser } from '@/contexts/child_context/userContext';
import Image from 'next/image';
import { LanguageSwitcher } from './LanguageSwitcher';
import TopWinners from './TopWinners';



const Header = () => {

    const { user } = useUser();

    const pathName = usePathname();


    return (
        <>
            {typeof user === 'object' ? (
                <LoggedInHeader />
            ) : (
                <div className="header">
                    <div className="md:hidden flex items-center justify-between">
                        <TopWinners />
                    </div>

                    <div className="flex justify-between items-center">
                    
                        <Link
                            href='/'
                        >
                            <Image
                                src='/logo-light.png'
                                width={100}
                                height={100}
                                alt='light version logo'
                            />
                        </Link>
                        
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