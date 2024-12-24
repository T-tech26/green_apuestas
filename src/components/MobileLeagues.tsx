import { useLeague } from '@/contexts/child_context/leagueContext';
import { Popular } from '@/types/globals';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input';

interface MobileLeaguesProps {
    selectedLink: string;
    setSelectedLink: (link: string) => void;
}

const MobileLeagues = ({ selectedLink, setSelectedLink }: MobileLeaguesProps) => {

    const { leagues, setLeagueID } = useLeague();
    const [selectedLeague, setSelectedLeague] = useState<number>(0);
    const [searchLeague, setSearchLeague] = useState('');
    const [searchedLeagues, setSearchedLeagues] = useState<Popular[]>([]);


    useEffect(() => {
        if(leagues.length > 0) {
            setSelectedLeague(leagues[0].id);
        }
    }, [leagues]);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const searchedLeague = leagues.filter(league => league.name.includes(searchLeague));

        setSearchedLeagues(searchedLeague);
    }, [searchLeague]);
    /* eslint-enable react-hooks/exhaustive-deps */

    

    return (
        <div
            className={`mobile-league ${
                selectedLink === 'Leagues' ? 'flex' : 'hidden'
            }`}
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


            <div className="w-4/5 h-auto mb-5">

                <Input
                    placeholder='Search for leagues...'
                    value={searchLeague}
                    className='py-2 px-3 w-full placeholder:text-color-30 text-color-30 text-sm focus:border-none focus:outline-none bg-color-60 bg-opacity-80'
                    onChange={e => setSearchLeague(e.target.value)}
                />
                
            </div>
            

            {searchedLeagues.length > 0 ? (
                searchedLeagues.map((item) => {
                    return (
                        <p
                            key={item.id}
                            className={`flex gap-2 items-center text-left w-4/5 py-2 px-3 text-color-30 text-sm hover:border-color-60 hover:border-b-2 cursor-pointer ${
                                selectedLeague === item.id ? 'bg-color-60' : ''
                            }`}
                            onClick={() => {
                                setLeagueID(item.id)
                                setSelectedLeague(item.id)
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
                })
            ) : (
                leagues.map((item) => {
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

                })
            )}
        </div>
    )
}

export default MobileLeagues