import { useUser } from '@/contexts/child_context/userContext';
import { useUserSlipContext } from '@/contexts/child_context/userSlipContext';
import { formatAmount } from '@/lib/utils';
import { UserData, UserGame } from '@/types/globals';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';


interface BetsProps {
    selectedLink: string | null;
    setSelectedLink: (link: string) => void;
}


const MobileBetHistory = ({ selectedLink, setSelectedLink }: BetsProps) => {

    const { user } = useUser();
    const { userSlips, getUserSlips, userSlipsLoading, setUserSlipsLoading } = useUserSlipContext();

    const [userWithSlip, setUserWithSlip] = useState<UserGame[]>([]);
    const [showBets, setShowBet] = useState<string | number>('');


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if(userSlips.length > 0) {
            const filteredUserWithSlip: UserGame[] = userSlips.filter(slip => slip.userId === (user as UserData).userId);
            setUserWithSlip(filteredUserWithSlip.reverse());
            setUserSlipsLoading(false);
        }   
    }, [userSlips]);

    useEffect(() => {
        if(!userSlips.length) {
            getUserSlips();
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


    return (
        <div
            className={`fixed top-0 bottom-0 w-full h-auto bg-color-30 pt-12 cursor-pointer lg:hidden z-50 overflow-y-scroll ${
                selectedLink === 'Bet history' ? 'block' : 'hidden'
            }`}
        >
            <Image
                src='/close.svg'
                width={25}
                height={25}
                alt='close icon'
                className='absolute top-5 right-5 bg-color-10'
                onClick={() => setSelectedLink('Home')}
            />


            {typeof user === 'object' ? (
                <div>
                    {userWithSlip.length > 0 ? (
                        <div className='w-full'>
                            {userWithSlip.map((slip, index) => {

                                if(!slip.showBet) {
                                    return (
                                        <div 
                                            key={slip.$id}
                                            className={`bg-color-30 rounded-md mb-4 w-[330px] animate-pulse h-[48px] overflow-hidden cursor-pointer ${
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
                                        className={`bg-color-30 rounded-md mb-4 mx-auto w-full max-w-[330px] h-[48px] overflow-hidden cursor-pointer ${
                                            showBets === slip.$id ? 'showBets' : 'hideBets'
                                        }`}
                                        onClick={() => handleAnimation((slip.$id as string), index)}
                                    >
                                        <div className='bg-light-gradient-135deg px-5 py-2 rounded-t-md flex flex-col gap-1 md:flex-row justify-between'>
                                            <p className='flex flex-col justify-between text-color-30 text-xs font-medium'>
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
                                                    <div className='flex items-center relative gap-2'>
                                                        <p className='text-left text-color-60 text-xs text-wrap'>{game.home}</p>
                                                        <span className='text-color-60 text-xs'>-</span>
                                                        <p className='text-right text-color-60 text-xs text-wrap'>{game.away}</p>
                                                    </div>

                                                    <p className='flex items-center gap-3 text-gray-400 text-xs'>Correct score</p>

                                                    <p className='text-color-60 text-[10px] font-semibold flex justify-between'>{game.homeGoal} - {game.awayGoal}
                                                        <span className='flex-1 text-right'>{game.odd}</span>
                                                    </p>

                                                    <p className='text-green-400 text-[11px] font-semibold'>won</p> 

                                                    <p className='text-[10px] text-gray-400'>{game.matchTime}</p>
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
                                                <span>${formatAmount(slip.stake)}</span>
                                            </p>

                                            <p className='flex justify-between text-color-60 text-xs'>
                                                <span>Payout:</span> 
                                                <span>${formatAmount(slip.payout)}</span>
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : userSlipsLoading ? (
                        <>
                            <div className="animate-pulse">
                                <div className='h-12 bg-gray-300 rounded-md w-[330px] mx-auto'></div>
                            </div>
                            <div className="animate-pulse">
                                <div className='h-12 bg-gray-300 rounded-md w-[330px] mx-auto'></div>
                            </div>
                            <div className="animate-pulse">
                                <div className='h-12 bg-gray-300 rounded-md w-[330px] mx-auto'></div>
                            </div>
                        </>
                    ) : (
                        <div className='w-full py-4 flex flex-col items-center justify-center gap-2'>
                            <p className='text-color-60 text-sm font-semibold'>No bets!</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className='h-full flex flex-col justify-center items-center'>
                    <div className='w-4/5 md:w-[500px] bg-light-gradient-135deg rounded-md py-10 text-center'>
                        <p className='text-sm text-color-30 text-center tracking-wide font-semibold mb-5'>Login to see your bet history</p>
                        <Link 
                            href='/signin'
                            className='px-7 py-1 bg-dark-gradient-135deg rounded-full text-sm text-color-30 mx-auto'
                        >
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MobileBetHistory