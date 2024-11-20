import React from 'react'
import { useLeague } from '@/contexts/child_context/leagueContext'

const TodayEvents = () => {

    const { todayMatches } = useLeague();

    return (
        <div className={`${ !todayMatches.matches.length ? 'hidden' : 'block' }`}>
            <div
                className='flex mb-3 pr-4 md:pr-3'
            >
                <p className='text-color-30 text-sm italic flex-1'>Today</p>
                <p className='text-color-30 text-sm italic w-14 md:w-16 text-center'>Home</p>
                <p className='text-color-30 text-sm italic w-14 md:w-16 text-center'>Draw</p>
                <p className='text-color-30 text-sm italic w-14 md:w-16 text-center'>Away</p>
            </div>

            <div>
                {todayMatches.matches.map((data) => {

                    let formattedTime;
                    
                    if(data.status?.utcTime) {
                        // Convert the time string to a Date object
                        const matchTime = new Date(data.status?.utcTime);
        
                        // Extract hours, minutes, and seconds
                        const hours = matchTime.getUTCHours().toString().padStart(2, '0');
                        const minutes = matchTime.getUTCMinutes().toString().padStart(2, '0');
        
                        // Format the time as HH:mm:ss
                        formattedTime = `${hours}:${minutes}`;
                    }

                    return (
                        <div
                            key={data.id}
                            className='px-3 py-1 bg-color-30 border-b-2 border-color-60 flex justify-evenly items-center gap-3'
                        >
                            <span className='score'>{formattedTime}</span>

                            <div className='team-container !py-3'>
                                <div className='flex justify-between'>
                                    <span className='team'>{data.home?.name}</span>
                                    <span className='score !text-color-60 w-[10%]'>vs</span>
                                    <span className='team'>{data.away?.name}</span>
                                </div>
                            </div>
                        </div>  
                    )
                })}
            </div>
        </div>
    )
}

export default TodayEvents