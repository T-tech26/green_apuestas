import { Leagues } from '@/constants';
import Image from 'next/image';
import React from 'react'

interface MobileLeaguesProps {
    selectedLink: string | null;
    setSelectedLink: (link: string) => void;
}

const MobileLeagues = ({ selectedLink, setSelectedLink }: MobileLeaguesProps) => {

  return (
    <div
        className={`absolute top-0 w-full h-auto flex-col justify-start items-center bg-light-gradient-135deg pt-5 cursor-pointer md:hidden ${
            selectedLink === 'Leagues' ? 'flex' : 'hidden'
        }`}
        onClick={() => setSelectedLink('Home')}
    >
        {Leagues.map((item) => {
            return (
                <div>
                    <Image
                        src='/close.svg'
                        width={25}
                        height={25}
                        alt='close icon'
                        className='absolute top-5 right-5'
                        onClick={() => setSelectedLink('Home')}
                    />
                    <p
                        key={item.league}
                        className='flex gap-2 items-center py-2 px-3 text-color-30 hover:border-color-60 hover:border-b-2 cursor-pointer'
                        onClick={() => setSelectedLink('Home')}
                    >
                        <Image 
                            src={item.icon}
                            width={20}
                            height={20}
                            alt='league icon'
                        />

                        {item.league}
                    </p>
                </div>
            )
        })}
    </div>
  )
}

export default MobileLeagues