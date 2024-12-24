import React, { useEffect, useState } from 'react'
import { LiveMatch } from '@/types/globals';
import { fetchLiveMatches } from '@/lib/apiUtils';
import { Loader2 } from 'lucide-react';

interface LiveEventProps {
    selectedEvent: string
}

const LiveEvents = ({ selectedEvent }: LiveEventProps) => {

    const [lives, setLives] = useState<LiveMatch[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    

    useEffect(() => {
        fetchLiveMatches(setLives, setIsLoading);
    }, []);



    return (
        <div>
            <p className='text-color-30 text-sm italic mb-3'>Live</p>
            {isLoading ? (
                <div className='flex justify-center items-center'>
                    <Loader2 size={30} className='animate-spin text-color-30'/>
                </div>
            ): (
                <>
                    {lives.length ? (
                        <div>
                            {selectedEvent === 'Live' ? 
                                lives.map((data) => {
                                return (
                                    <div
                                        key={data.id}
                                        className='px-3 py-1 bg-color-30 border-b-2 border-color-60 flex justify-evenly items-center gap-3'
                                    >
                                        <span className='score animate-pulse'>{data.status.liveTime.short}</span>

                                        <div className='team-container'>
                                            <div className='flex justify-between mb-1'>
                                                <span className='team'>{data.home.name}</span>
                                                <span className='score !text-color-60 w-[10%]'>vs</span>
                                                <span className='team'>{data.away.name}</span>
                                            </div>

                                            <div className='scores-container'>
                                                <span className='score w-2/5'>{data.home.score}</span>
                                                <span className='score w-[10%]'>-</span>
                                                <span className='score w-2/5'>{data.away.score}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                lives.slice(0,10).map(data => {
                                    return (
                                        <div
                                            key={data.id}
                                            className='px-3 py-1 bg-color-30 border-b-2 border-color-60 flex justify-evenly items-center gap-3'
                                        >
                                            <span className='score animate-pulse'>{data.status.liveTime.short}</span>

                                            <div className='team-container'>
                                                <div className='flex justify-between mb-1'>
                                                    <span className='team'>{data.home.name}</span>
                                                    <span className='score !text-color-60 w-[10%]'>vs</span>
                                                    <span className='team'>{data.away.name}</span>
                                                </div>

                                                <div className='scores-container'>
                                                    <span className='score w-2/5 text-center'>{data.home.score}</span>
                                                    <span className='score w-[10%]'>-</span>
                                                    <span className='score w-2/5 text-center'>{data.away.score}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    ) : (
                        <div>
                            <p className='text-xs text-color-30 text-center'>No live matches</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default LiveEvents