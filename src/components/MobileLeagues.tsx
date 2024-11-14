import { LeaguesDetails } from '@/constants';
import Image from 'next/image';
import React from 'react'

interface MobileLeaguesProps {
    selectedLink: string | null;
    setSelectedLink: (link: string) => void;
}

const MobileLeagues = ({ selectedLink, setSelectedLink }: MobileLeaguesProps) => {

  return (
    <div
        className={`mobile-league ${
            selectedLink === 'Leagues' ? 'flex' : 'hidden'
        }`}
        onClick={() => setSelectedLink('Home')}
    >

        <div>
            <Image
                src='/close.svg'
                width={25}
                height={25}
                alt='close icon'
                className='absolute top-5 right-5'
                onClick={() => setSelectedLink('Home')}
            />
        </div>
        {LeaguesDetails.map((item) => {
            return (
                <p
                    key={item.league}
                    className='flex gap-2 items-center py-2 px-3 text-color-30 text-sm hover:border-color-60 hover:border-b-2 cursor-pointer'
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
            )
        })}
    </div>
  )
}

export default MobileLeagues