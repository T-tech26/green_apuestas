import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Input } from './ui/input'
import { useLeague } from '@/contexts/child_context/leagueContext'
import { Loader2 } from 'lucide-react'
import { Popular } from '@/types/globals'

const Leagues = () => {

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
                searchedLeagues.map((item) => {
                    return (
                        <p
                            key={item.id}
                            className={`bg-opacity-90 text-wrap flex gap-1 items-center py-3 text-color-30 text-xs hover:border-color-60 hover:border-b-2 cursor-pointer ${selectedLeague === item.id ? 'bg-color-60' : ''}`}
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
                            className={`bg-opacity-90 text-wrap flex gap-1 items-center py-3 text-color-30 text-xs hover:border-color-60 hover:border-b-2 cursor-pointer ${selectedLeague === item.id ? 'bg-color-60' : ''}`}
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
            )}
        </aside>
    )
}

export default Leagues