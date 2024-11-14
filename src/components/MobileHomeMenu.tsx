import { MobileHomeMenuLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface MobileMenuProps {
    selectedLink: string | null;
    setSelectedLink: (link: string) => void;
}

const MobileHomeMenu = ({selectedLink, setSelectedLink}: MobileMenuProps) => {

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
                    {link.icon === '0' ?
                        <span className='text-lg'>{link.icon}</span> :
                        <Image 
                            src={link.icon}
                            width={25}
                            height={25}
                            alt='menu icons'
                        />
                    }

                    {link.name}
                </Link>
            )
        })}
    </nav>
  )
}

export default MobileHomeMenu