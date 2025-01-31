'use client'
import EditUserTicket from '@/components/EditUserTicket';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/child_context/userContext'
import { useUserSlipContext } from '@/contexts/child_context/userSlipContext';
import { toast } from '@/hooks/use-toast';
import { creditUserBalance, getGameTickets, showBetSlip, userNotification } from '@/lib/actions/userActions';
import { formatAmount, generateDateString } from '@/lib/utils';
import { UserData, UserGame } from '@/types/globals';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'


interface UserWithSlip {
    slip: UserGame,
    user: UserData,
}


const UserBetHistory = () => {

    const { allUsers, getUsers } = useUser();
    const { userSlips, setUserSlips, getUserSlips, userSlipsLoading, setUserSlipsLoading } = useUserSlipContext();

    const [userWithBetSlip, setUserWithBetSlip] = useState<UserWithSlip[]>([]);
    const [showBets, setShowBet] = useState<string | number>('');
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');
    const [ticket, setTicket] = useState<UserWithSlip | string>('');


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {

        if (userSlips.length > 0 && allUsers.length > 0) {
            // Map over the userSlips and find the user associated with each slip
            const mappedUserWithSlip: UserWithSlip[] = userSlips.map((slip: UserGame) => {
                // Find the user that matches the userId in the slip
                const user = allUsers.find(user => user.userId === slip.userId);
        
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
            setUserWithBetSlip(mappedUserWithSlip.reverse());
            setUserSlipsLoading(false);
        }

    }, [allUsers, userSlips]);

    
    useEffect(() => {
        if(!userSlips.length) {
            getUserSlips();
        }

        if(!allUsers.length) {
            getUsers();
        }
    }, []);
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


    const handleShowBet = async (id: string, credit: boolean, userId: string, amount: string, shown: boolean) => {
        const date = generateDateString();
        setLoading(true);
        try {
            // if user has not been credited then credit the user balance and set user credited boolean value to true in slip
            if(credit === false) {
                const ticketWon = await creditUserBalance(userId, amount, 'credit');
                
                if(ticketWon === 'success') {
                    const updatedticketStatus = await showBetSlip(id, 'ticketWon');

                    if(updatedticketStatus !== 'success') return;

                    // notify the user that the ticket is won
                    await userNotification(userId, 'ticketWon', date, amount);

                    // get all the slips
                    const slips = await getGameTickets();
                    if(typeof slips === 'string') return;
                    setUserSlips(slips);

                    toast({
                        description: 'User credited and ticket shown to user'
                    })

                    return;
                }
            }

            // show bet slip takes in two arguments one the id of the slip two an argument if the ticket is won
            const response = await showBetSlip(id, '');

            if(response !== 'success') return;

            // get the slips
            const slips = await getGameTickets();
            if(typeof slips === 'string') return;
            setUserSlips(slips);

            const message = shown ? 'Ticket hidden from user.' : 'Ticket shown to user';

            toast({
                description: message
            })
            
        /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (error: any) {
            /* eslint-enable @typescript-eslint/no-explicit-any */
            console.error("Error showing user bet", error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <main className='flex-1 py-14 overflow-x-scroll md:overflow-x-hidden address overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-5'>
                <h1 className='text-lg text-color-60 font-medium mb-5 uppercase'>User bets history</h1>

                {userWithBetSlip.length > 0 ? (
                    <>
                        {userWithBetSlip.map((slip, index) => {
                            return (
                                <div key={slip.slip.$id} className='w-full'>

                                    <div className='flex items-center justify-between gap-2 max-w-[330px] mx-auto'>
                                        <p className='text-color-10 text-base mb-2 flex-1'>{slip.user.firstname} {slip.user.lastname}</p>

                                        <Button
                                            className='h-6 bg-light-gradient-135deg text-xs text-color-30 rounded-full'
                                            onClick={() => setTicket(slip)}
                                        >
                                            Edit ticket
                                        </Button>

                                        <Button
                                            disabled={loading && id === slip.slip.$id}
                                            className='h-6 bg-light-gradient-135deg text-xs text-color-30 rounded-full'
                                            onClick={() => {
                                                handleShowBet(
                                                    (slip.slip.$id as string), 
                                                    (slip.slip.creditUser as boolean), 
                                                    (slip.slip.userId as string),
                                                    (slip.slip.payout as string),
                                                    (slip.slip.showBet as boolean),
                                                );
                                                setId((slip.slip.$id as string));
                                            }}
                                        >
                                            {loading && id === slip.slip.$id ? (
                                                <>
                                                    <Loader2 size={20} className='animate-spin'/>&nbsp; 
                                                    Loading...
                                                </>
                                            ): slip.slip.showBet ? 'Hide slip' : 'Show slip'}
                                        </Button>
                                    </div>
                                    
                                    <div 
                                        className={`bg-color-30 rounded-md w-full max-w-[330px] h-[48px] overflow-hidden cursor-pointer mx-auto ${
                                            showBets === slip.slip.$id ? 'showBets' : 'hideBets'
                                        }`}
                                        onClick={() => handleAnimation((slip.slip.$id as string), index)}
                                    >
                                        <div className='bg-light-gradient-135deg px-5 py-2 rounded-t-md flex flex-col gap-1 md:flex-row justify-between'>
                                            <p className='flex flex-col justify-between text-color-30 text-xs font-medium'>
                                                <span>Multiple</span>
                                                <span>Ticket ID: {slip.slip.$id && slip.slip.$id.slice(0, 8)}</span>
                                            </p>

                                            <p className='flex flex-col justify-between text-color-30 text-xs'>
                                                {slip.slip.showBet === true && (
                                                    <span>won</span>
                                                )}
                                                <span>{slip.slip.date}</span>
                                            </p>
                                        </div>

                                        {slip.slip.games.map((game, index) => {
                                            return (
                                                <div 
                                                    key={index} 
                                                    className='px-5 py-1 border-b border-gray-300 relative'
                                                >
                                                    <div className='flex items-center relative gap-2'>
                                                        <p className='text-left text-color-60 text-xs text-wrap'>{game.home}</p>
                                                        <span className='text-color-60 text-xs'>-</span>
                                                        <p className='text-right text-color-60 text-xs text-wrap'>{game.away}</p>
                                                    </div>
        
                                                    <p className='flex items-center gap-3 text-gray-400 text-xs'>Correct score</p>

                                                    <p className='text-color-60 text-[10px] font-semibold flex justify-between'>{game.homeGoal} - {game.awayGoal}
                                                        <span>{game.odd}</span>
                                                    </p>

                                                    {slip.slip.showBet === true && (
                                                        <p className='text-green-400 text-[11px] font-semibold'>won</p> 
                                                    )}

                                                    <p className='text-[10px] text-gray-400'>{game.matchTime}</p>
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
                                                <span>${formatAmount(slip.slip.stake)}</span>
                                            </p>

                                            <p className='flex justify-between text-color-60 text-xs'>
                                                <span>Payout:</span> 
                                                <span>${formatAmount(slip.slip.payout)}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                ) : userSlipsLoading && !userWithBetSlip.length ? (
                    <>
                        <div className="animate-pulse">
                            <div className='mx-auto flex items-center justify-between w-[330px]'>
                                <p className='w-28 h-5 mb-2 bg-gray-300 rounded-md'></p>
                                <p className='w-20 h-6 mb-2 bg-gray-300 rounded-full'></p>
                            </div>
                            <div className='mx-auto h-12 bg-gray-300 rounded-md w-[330px]'></div>
                        </div>
                        <div className="animate-pulse">
                            <div className='mx-auto flex items-center justify-between w-[330px]'>
                                <p className='w-28 h-5 mb-2 bg-gray-300 rounded-md'></p>
                                <p className='w-20 h-6 mb-2 bg-gray-300 rounded-full'></p>
                            </div>
                            <div className='mx-auto h-12 bg-gray-300 rounded-md w-[330px]'></div>
                        </div>
                        <div className="animate-pulse">
                            <div className='mx-auto flex items-center justify-between w-[330px]'>
                                <p className='w-28 h-5 mb-2 bg-gray-300 rounded-md'></p>
                                <p className='w-20 h-6 mb-2 bg-gray-300 rounded-full'></p>
                            </div>
                            <div className='mx-auto h-12 bg-gray-300 rounded-md w-[330px]'></div>
                        </div>
                    </>
                ) : (
                    <div className='w-full py-4 flex flex-col items-center justify-center gap-2'>
                        <p className='text-color-60 text-sm font-semibold'>No user slips!</p>
                    </div>
                )}
            </div>

            {ticket !== '' && (
                <EditUserTicket ticket={ticket} setTicket={setTicket} />
            )}
        </main>
    )
}

export default UserBetHistory