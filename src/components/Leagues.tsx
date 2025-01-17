import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Input } from './ui/input'
import { useLeague } from '@/contexts/child_context/leagueContext'
import { Loader2 } from 'lucide-react'
import { Popular } from '@/types/globals'

const Leagues = () => {

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
        <aside
            className='w-[281px] h-[99.5%] bg-light-gradient-180deg-reverse px-[29px] py-8 hidden lg:block'
        >
            <div className="h-auto mb-5">

                <Input
                    placeholder='Search for leagues...'
                    value={searchLeague}
                    className='py-2 px-3 placeholder:text-color-30 text-color-30 text-sm focus:border-none focus:outline-none bg-color-60 bg-opacity-80'
                    onChange={e => setSearchLeague(e.target.value)}
                />
                
            </div>
                 

            {leagues.length === 0 ? (
                <div className='w-full h-full flex justify-center items-center'>
                    <Loader2 size={50} className='animate-spin text-color-30'/>
                </div>
            ) : searchedLeagues.length > 0 ? (

                <>
                    {searchedLeagues.map(league => {
                        return (
                            <p
                                key={league.id}
                                className={`bg-opacity-90 text-wrap flex gap-1 items-center py-3 text-color-30 text-xs hover:border-color-60 hover:border-b cursor-pointer ${selectedLeague.includes(league.id) ? 'bg-color-60' : ''}`}
                                onClick={() => {
                                    setLeagueID(league.id)
                                    setSelectedLeague(() => [league.id])
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
                    })}
                </>
            ) : (
                leagues.map((item, index) => {
                    return (
                        <div
                            key={item.ccode}
                            className={`overflow-hidden cursor-pointer ${
                                openCountryLeague === item.ccode ? 'open-league bg-color-60' : 'close-league'
                            }`}
                            translate='no'
                        >
                            <p
                                className={`bg-opacity-90 text-wrap flex gap-1 items-center px-1 py-3 text-color-30 text-sm hover:border-color-60 hover:border-b cursor-pointer mb-1 ${selectedLeague.includes(item.ccode) ? 'bg-color-60' : ''}`}
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
        </aside>
    )
}

export default Leagues