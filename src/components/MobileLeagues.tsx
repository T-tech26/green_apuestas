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
    const [selectedLeague, setSelectedLeague] = useState<(number | string)[]>([]);
    const [searchLeague, setSearchLeague] = useState('');
    const [searchedLeagues, setSearchedLeagues] = useState<Popular[]>([]);
    const [openCountryLeague, setOpenCountryLeague] = useState<number | string>('');


    useEffect(() => {
        if(leagues.length > 0) {
            setSelectedLeague(() => [leagues[0].ccode, leagues[0].leagues[0].id
            ]);
        }
    }, [leagues]);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const searchedLeague = leagues.flatMap(cleague => {
            const matchedLeague = cleague.leagues.filter(sleague => sleague.name === searchLeague);

            return matchedLeague;
        })

        setSearchedLeagues(searchedLeague);
    }, [searchLeague]);
    /* eslint-enable react-hooks/exhaustive-deps */


    const handleAnimation = (ccode: string, index: number) => {
        if(openCountryLeague === ccode) {
            setOpenCountryLeague(index);
        } else if(openCountryLeague === index) {
            setOpenCountryLeague(ccode);
        } else {
            setOpenCountryLeague(ccode);
        }
    }

    

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
            

            <div>
                {searchedLeagues.length > 0 ? (
                    searchedLeagues.map((item) => {
                        return (
                            <p
                                key={item.id}
                                className={`flex gap-2 items-center text-left w-4/5 py-2 px-3 text-color-30 text-sm hover:border-color-60 hover:border-b-2 cursor-pointer ${
                                    selectedLeague.includes(item.id) ? 'bg-color-60' : ''
                                }`}
                                onClick={() => {
                                    setLeagueID(item.id)
                                    setSelectedLeague(() => [item.id])
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
                    leagues.map((item, index) => {
                        return (
                            <div
                                key={item.ccode}
                                className={`overflow-hidden w-[300px] cursor-pointer ${
                                    openCountryLeague === item.ccode ? 'open-league bg-color-60' : 'close-league'
                                }`}
                            >
                                <p
                                    className={`text-left py-[13px] px-3 text-color-30 text-sm hover:border-color-60 hover:border-b cursor-pointer ${
                                        selectedLeague.includes(item.ccode) ? 'bg-color-60' : ''
                                    }`}
                                    onClick={() => {
                                        if(!selectedLeague.includes(item.ccode)) {
                                            setSelectedLeague(() => [item.ccode] );
                                        }
                                        handleAnimation(item.ccode, index);
                                    }}
                                >
                                    {item.name}
                                </p>


                                {selectedLeague.includes(item.ccode) && (
                                    item.leagues.map(league => {
                                    return (
                                        <p
                                            key={league.id}
                                            className={`bg-opacity-90 text-wrap flex gap-1 items-center pl-5 py-3 text-color-30 text-xs hover:border-color-10 hover:border-b cursor-pointer ${selectedLeague.includes(league.id) ? 'bg-color-10' : ''}`}
                                            onClick={() => {
                                                setSelectedLink('Home');
                                                setLeagueID(league.id)
                                                setSelectedLeague(() => [item.ccode, league.id]);
                                            }}
                                        >
                                            <Image 
                                                src={league.logo}
                                                width={20}
                                                height={20}
                                                alt='league icon'
                                            />
                                
                                            {league.name}
                                        </p>
                                    )
                                }))}
                            </div>
                        )

                    })
                )}
            </div>
        </div>
    )
}

export default MobileLeagues