import React from 'react'
import { useLeague } from '@/contexts/child_context/leagueContext';
import { groupMatchesByDate } from '@/lib/apiUtils';

const OtherDayEvents = () => {

    const { otherDayMatches } = useLeague();

    // Group matches by their date using the utility function
    const groupedMatches = groupMatchesByDate(otherDayMatches);

    return (
        <div>
            {Object.entries(groupedMatches).length > 0 ? (
                Object.entries(groupedMatches).map(([date, matches]) => (
                <div key={date} className='mb-5'>
                    <div className='flex mb-3 pr-4 md:pr-3'>
                        <p className='text-color-30 text-sm italic flex-1'>{date}</p>
                    </div>
                
                    <div>
                        {matches.map((data) => {
                            
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
                                translate='no'
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
            ))) : (
                <div>
                    <div
                        className='flex mb-3 pr-4 md:pr-3'
                    >
                        <p className='text-color-30 text-sm italic flex-1'>Upcoming</p>
                    </div>
                    <div>
                        <p className='text-xs text-color-30 text-center py-5'>No upcoming matches</p>
                    </div>
                </div>
            )}

        </div>
    )
}

export default OtherDayEvents