'use client'
import { useOtherContext } from '@/contexts/child_context/otherContext';
import { useUser } from '@/contexts/child_context/userContext'
import { UserData, UserGame } from '@/types/globals';
import React, { useEffect, useState } from 'react'

const BetHistory = () => {

    const { user } = useUser();
    const { userSlips } = useOtherContext();

    const [userWithSlip, setUserWithSlip] = useState<UserGame[]>([]);
    const [showBets, setShowBet] = useState<string | number>('');
    const [userBetsLoading, setUserBetsLoading] = useState(true);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if(userSlips.length > 0) {
            const filteredUserWithSlip: UserGame[] = userSlips.filter(slip => slip.userId === (user as UserData).userId);
            setUserWithSlip(filteredUserWithSlip.reverse());
            if(userBetsLoading) setUserBetsLoading(!userBetsLoading);
        }
    }, [userSlips]);
    /* eslint-enable react-hooks/exhaustive-deps */



    const handleAnimation = (id: string, index: number) => {
        if(showBets === id) {
            setShowBet(index);
        } else if(showBets === index) {
            setShowBet(id);
        } else {
            setShowBet(id);
        }
    }


    return (
        <main className='flex-1 py-14 overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-4'>
                <h1 className='text-lg text-color-60 font-medium mb-5'>BET HISTORY</h1>

                {userWithSlip.length > 0 ? (
                    <>
                        {userWithSlip.map((slip, index) => {

                            if(!slip.showBet) {
                                return (
                                    <div 
                                        key={slip.$id}
                                        className={`bg-color-30 rounded-md min-w-[300px] animate-pulse h-[48px] overflow-hidden cursor-pointer ${
                                            showBets === slip.$id ? 'showBets' : 'hideBets'
                                        }`}
                                        onClick={() => handleAnimation((slip.$id as string), index)}
                                    >
                                        <div className='bg-gray-200 px-5 py-2 rounded-t-md flex justify-between'>
                                            <p className='w-32 h-8 bg-gray-300 rounded-md'></p>

                                            <p className='w-20 h-8 bg-gray-300 rounded-md'>
                                            </p>
                                        </div>
    
                                        {slip.games.map(game => {
                                            return (
                                                <div 
                                                    key={game.$id}
                                                    className='bg-gray-300 h-20 border-b border-color-60'
                                                >
                                                    <div className='flex items-center justify-between py-1 px-5 mb-1 relative'>
                                                        <p className='bg-gray-200 h-4 w-32 rounded-md'></p>
                                                        <span className='bg-gray-200 h-2 w-2'></span>
                                                        <p className='bg-gray-200 h-4 w-32 rounded-md'></p>
                                                    </div>

                                                    <div className='py-1 px-5'>
                                                        <p className='flex items-center justify-between'>
                                                            <span className='bg-gray-200 h-4 w-32 rounded-md'></span> 
                                                            <span className='bg-gray-200 h-4 w-32 rounded-md'></span>
                                                        </p>
                                                        <p className='flex items-center justify-between py-2 relative'>
                                                            <span className='bg-gray-200 h-4 w-16 rounded-md'></span> 
                                                            <span className='bg-gray-200 h-2 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'></span>
                                                            <span className='flex items-center justify-between w-16'>
                                                                <span className='bg-gray-200 h-2 w-2 rounded-sm'></span> 
                                                                <span className='bg-gray-200 h-1 w-2 rounded-sm'></span> 
                                                                <span className='bg-gray-200 h-2 w-2 rounded-sm'></span>
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
    
                                        <div className='px-5 py-3 rounded-b-md flex flex-col gap-1'>
                                            <p className='flex justify-between'>
                                                <span className='bg-gray-300 h-3 w-14 rounded-md'></span> 
                                                <span className='bg-gray-300 h-3 w-7 rounded-md'></span> 
                                            </p>

                                            <p className='flex justify-between'>
                                                <span className='bg-gray-300 h-3 w-12 rounded-md'></span> 
                                                <span className='bg-gray-300 h-3 w-12 rounded-md'></span> 
                                            </p>

                                            <p className='flex justify-between'>
                                                <span className='bg-gray-300 h-3 w-16 rounded-md'></span> 
                                                <span className='bg-gray-300 h-3 w-16 rounded-md'></span> 
                                            </p>
                                        </div>
                                    </div>
                                )
                            }

                            return (
                                <div 
                                    key={slip.$id}
                                    className={`bg-color-30 rounded-md min-w-[300px] h-[48px] overflow-hidden cursor-pointer ${
                                        showBets === slip.$id ? 'showBets' : 'hideBets'
                                    }`}
                                    onClick={() => handleAnimation((slip.$id as string), index)}
                                >
                                    <div className='bg-light-gradient-135deg px-5 py-1 rounded-t-md flex justify-between'>
                                        <p className='flex flex-col justify-between text-color-30 text-sm font-medium'>
                                            <span>Multiple</span>
                                            <span>Ticket ID: {slip.$id && slip.$id.slice(0, 8)}</span>
                                        </p>

                                        <p className='flex flex-col justify-between text-color-30 text-xs'>
                                            <span>won</span>
                                            <span>{slip.date}</span>
                                        </p>
                                    </div>

                                    {slip.games.map((game, index) => {
                                        return (
                                            <div 
                                                key={index} 
                                                className='px-5 py-1 border-b border-gray-300 relative'
                                            >
                                                <div className='flex items-center justify-evenly py-1 mb-1 relative'>
                                                    <p className='text-left text-color-60 text-xs w-full text-wrap'>{game.home}</p>
                                                    <span className='text-color-60 text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>vs</span>
                                                    <p className='text-right text-color-60 text-xs w-full text-wrap'>{game.away}</p>
                                                </div>
    
                                                <div className='py-1'>
                                                    <p className='flex items-center justify-between text-gray-400 text-xs'>
                                                        <span>Market</span> 
                                                        <span>Correct score</span>
                                                    </p>
                                                    <p className='flex items-center justify-between text-color-60 text-xs w-full relative'>
                                                        <span className='text-green-400 font-semibold'>won</span> 
                                                        <span className='text-[10px] text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>{game.odd}</span>
                                                        <span>{game.homeGoal} - {game.awayGoal}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    <div className='px-5 py-3 rounded-b-md'>
                                        <p className='flex justify-between text-color-60 text-xs'>
                                            <span>Total Odds</span> 
                                            <span>{slip.totalOdds}</span>
                                        </p>

                                        <p className='flex justify-between text-color-60 text-xs'>
                                            <span>Stake</span> 
                                            <span>${slip.stake}</span>
                                        </p>

                                        <p className='flex justify-between text-color-60 text-xs'>
                                            <span>Payout:</span> 
                                            <span>${slip.payout}</span>
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                ) : !userBetsLoading ? (
                    <div className='w-full py-4 flex flex-col items-center justify-center gap-2'>
                        <p className='text-color-60 text-sm font-semibold'>No bets!</p>
                    </div>
                ) : (
                    <>
                        <div className="animate-pulse">
                            <div className='w-full h-12 bg-gray-300 rounded-md'></div>
                        </div>
                        <div className="animate-pulse">
                            <div className='w-full h-12 bg-gray-300 rounded-md'></div>
                        </div>
                        <div className="animate-pulse">
                            <div className='w-full h-12 bg-gray-300 rounded-md'></div>
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}

export default BetHistory