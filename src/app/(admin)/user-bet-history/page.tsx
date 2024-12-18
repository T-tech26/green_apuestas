'use client'
import { useOtherContext } from '@/contexts/child_context/otherContext';
import { useUser } from '@/contexts/child_context/userContext'
import { UserData, UserGames } from '@/types/globals';
import React, { useEffect, useState } from 'react'


interface UserWithSlip {
    slip: UserGames,
    user: UserData,
}


const UserBetHistory = () => {

    const { allUsers } = useUser();
    const { userSlips } = useOtherContext();

    const [userWithBetSlip, setUserWithBetSlip] = useState<UserWithSlip[]>([]);
    const [showBets, setShowBet] = useState<string | number>('');


    useEffect(() => {

        if (userSlips.length > 0) {
            // Map over the userSlips and find the user associated with each slip
            const mappedUserWithSlip: UserWithSlip[] = userSlips.map((slip: UserGames) => {
                // Find the user that matches the userId in the slip
                const user = (allUsers as UserData[]).find(user => user.userId === slip.userId);
        
                if (user) {
                    // Return an object with both slip and user properties
                    return {
                        slip,  // `slip` will be added as a property
                        user   // `user` will be added as a property
                    };
                }
        
                // If no matching user is found, you can return an empty object or handle it as needed
                // But it should return an object of type `UserWithSlip`
                return null;
            }).filter((item): item is UserWithSlip => item !== null); // Type guard to filter out `null` values

            // Update the state with the userWithSlip data
            setUserWithBetSlip(mappedUserWithSlip);
        }

    }, [allUsers, userSlips]);
    
    
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
        <main className='flex-1 py-14 overflow-x-hidden overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-10'>
                <h1 className='text-lg text-color-60 font-medium'>USER BETS HISTORY</h1>

                {userWithBetSlip.length > 0 ? (
                    <>
                        {userWithBetSlip.map((slip, index) => {
                            return (
                                <div key={slip.slip.$id}>
                                    <p className='text-color-10 text-base mb-2' >{slip.user.firstname} {slip.user.lastname}</p>
                                    
                                    <div 
                                        className={`bg-color-30 rounded-md min-w-[300px] h-[48px] overflow-hidden cursor-pointer ${
                                            showBets === slip.slip.$id ? 'showBets' : 'hideBets'
                                        }`}
                                        onClick={() => handleAnimation((slip.slip.$id as string), index)}
                                    >
                                        <div className='bg-light-gradient-135deg px-5 py-1 rounded-t-md flex justify-between'>
                                            <p className='flex flex-col justify-between text-color-30 text-sm font-medium'>
                                                <span>Multiple</span>
                                                <span>Ticket ID: {slip.slip.$id && slip.slip.$id.slice(0, 8)}</span>
                                            </p>

                                            <p className='flex flex-col justify-between text-color-30 text-xs'>
                                                <span>{slip.slip.matchStatus}</span>
                                                <span>{slip.slip.date}</span>
                                            </p>
                                        </div>

                                        {slip.slip.games.map((game, index) => {
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
                                                            <span className='text-green-400 font-semibold'>{slip.slip.matchStatus}</span> 
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
                                                <span>{slip.slip.totalOdds}</span>
                                            </p>

                                            <p className='flex justify-between text-color-60 text-xs'>
                                                <span>Stake</span> 
                                                <span>${slip.slip.stake}</span>
                                            </p>

                                            <p className='flex justify-between text-color-60 text-xs'>
                                                <span>Payout:</span> 
                                                <span>${slip.slip.payout}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                ) : (
                    <div></div>
                )}
            </div>
        </main>
    )
}

export default UserBetHistory