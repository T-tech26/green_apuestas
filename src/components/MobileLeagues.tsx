import { useLeague } from '@/contexts/child_context/leagueContext';
import Image from 'next/image';
import React, { useState } from 'react'

interface MobileLeaguesProps {
    selectedLink: string;
    setSelectedLink: (link: string) => void;
}

const MobileLeagues = ({ selectedLink, setSelectedLink }: MobileLeaguesProps) => {

    const { leagues, setLeagueID } = useLeague();
    const [selectedLeague, setSelectedLeague] = useState<number>(0)

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
        {leagues.map((item) => {
            return (
                <p
                    key={item.id}
                    className={`flex gap-2 items-center text-left w-4/5 py-2 px-3 text-color-30 text-sm hover:border-color-60 hover:border-b-2 cursor-pointer ${
                        selectedLeague === item.id ? 'bg-color-60' : ''
                    }`}
                    onClick={() => {
                        setSelectedLink('Home');
                        setSelectedLeague(item.id);
                        setLeagueID(item.id);
                    }}
                >
                    <Image 
                        src={item.logo}
                        width={20}
                        height={20}
                        alt='league icon'
                    />

                    {item.name}
                </p>
            )
        })}
    </div>
  )
}

export default MobileLeagues