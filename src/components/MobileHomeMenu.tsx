'use client'
import { MobileHomeMenuLinks } from '@/constants'
import { useUser } from '@/contexts/child_context/userContext';
import { useUserSlipContext } from '@/contexts/child_context/userSlipContext';
import { UserData, UserGame } from '@/types/globals';
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface MobileMenuProps {
    selectedLink: string | null;
    setSelectedLink: (link: string) => void;
}

const MobileHomeMenu = ({selectedLink, setSelectedLink}: MobileMenuProps) => {


    const { user } = useUser();
    const { userSlips } = useUserSlipContext();

    const [openBet, setOpenBet] = useState<UserGame>();


    useEffect(() => {
        if(userSlips.length) {
            const userBet = userSlips.filter(slip => slip.userId === (user as UserData).userId);
        
            const bet = userBet.reverse().find(slip => slip.showBet === false);
        
            setOpenBet(bet);
        }
    }, [user, userSlips]);


    return (
        <nav
            className='w-full flex justify-evenly fixed bottom-0 left-0 bg-dark-gradient-180deg lg:hidden'        
        >
            {MobileHomeMenuLinks.map((link) => {
                return (
                    <Link
                        key={link.name}
                        href={link.route}
                        className={`w-full text-color-30 flex flex-col justify-center items-center py-2 ${
                            selectedLink === link.name
                            ? 'bg-light-gradient-135deg'
                            : ''
                        } ${link.name === 'Betslips' ? 'border-none' : 'border-r-2 border-color-10'}`}
                        onClick={() => setSelectedLink(link.name)}
                    >
                        {link.icon === '0' ? (
                            <span className='text-lg'>
                                {openBet !== undefined ? <span className='relative'>1 <span className='absolute -top-5 -right-5 bg-color-10 rounded-full size-8 -z-50 animate-ping'></span></span> : <span>0</span>}
                            </span>
                        ) : (
                            <Image
                                src={link.icon}
                                width={20}
                                height={20}
                                alt='league icons'
                            />
                        )}

                        {link.name}
                    </Link>
                )
            })}
        </nav>
    )
}

export default MobileHomeMenu