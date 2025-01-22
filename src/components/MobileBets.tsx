'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Input } from './ui/input';
import { UserData, UserGame } from '@/types/globals';
import { useUser } from '@/contexts/child_context/userContext';
import { Button } from './ui/button';
import { formatAmount } from '@/lib/utils';
import { useUserSlipContext } from '@/contexts/child_context/userSlipContext';

interface BetsProps {
    selectedLink: string | null;
    setSelectedLink: (link: string) => void;
    type: string;
}

const MobileBets = ({ selectedLink, setSelectedLink, type }: BetsProps) => {

    const { user } = useUser();
    const { userSlips } = useUserSlipContext();

    const [openBet, setOpenBet] = useState<UserGame>();
    const [value, setValue] = useState('');
    const [ticket, setTicket] = useState<UserGame | string>('');


    useEffect(() => {
        if(userSlips.length) {
            const userBet = userSlips.filter(slip => slip.userId === (user as UserData).userId);
        
            const bet = userBet.reverse().find(slip => slip.showBet === false);
        
            setOpenBet(bet);
        }
    }, [user, userSlips]);
    
    
    
    const getTicket = () => {
    
        const ticketWithId = userSlips.map(ticket => {
          const ticketId = ticket.$id?.slice(0, 8);
    
          return {
            ...ticket,
            $id: ticketId
          };
        });
        
        const ticket = ticketWithId.find(ticket => ticket.$id === value);
        
        if(ticket !== undefined) {
          setTicket(ticket);
        } else {
          setTicket('No ticket');
        }
    }


    return (
        <>
            {type === 'Betslip' && (
                <div
                    className={`bets ${
                        selectedLink === 'Betslips' ? 'flex' : 'hidden'
                    }`}
                >
                    <div
                        className='w-4/5 md:w-[400px] h-[400px] py-5 px-3 bg-color-30 rounded-md overflow-y-scroll'
                    >
                        <Image
                            src='/close.svg'
                            width={25}
                            height={25}
                            alt='close icon'
                            className='absolute top-5 right-5'
                            onClick={() => setSelectedLink('Home')}
                        />
                        
                        {ticket === '' ? (
                            <div className='flex flex-col gap-3 justify-center items-center h-full w-full'>
                                <Input
                                    id='slip'
                                    placeholder='6761aade'
                                    type='text'
                                    className='py-3 px-3 placeholder:text-color-60 text-sm rounded-lg drop-shadow-sm focus:border-none focus:outline-none w-[90%]'
                                    onChange={(e) => setValue(e.target.value)}
                                />
            
                                <Button
                                    type='button'
                                    className='w-[90%] h-7 bg-light-gradient-135deg text-xs rounded-full'
                                    onClick={() => getTicket()}
                                >
                                    Get ticket
                                </Button>
                            </div>
                        ) : ticket === 'No ticket' ? (
                            <div className='flex flex-col gap-6 justify-center items-center w-full h-full'>
                                <p className='text-color-60 font-medium text-sm'>No ticket with ticket ID:{value}</p>

                                <Button
                                    type='button'
                                    className='w-[90%] h-7 bg-light-gradient-135deg text-xs rounded-full mx-auto'
                                    onClick={() => setTicket('')}
                                >
                                    Clear
                                </Button>
                            </div>
                        ) : (
                            <div className='flex flex-col gap-6'>
                                <div 
                                    className='bg-color-30 rounded-md h-auto overflow-hidden cursor-pointer drop-shadow-md w-full max-w-[330px] mx-auto'
                                >
                                    <div className='bg-light-gradient-135deg px-3 py-1 rounded-t-md flex flex-col md:flex-row justify-between'>
                                        <p className='flex flex-col justify-between text-color-30 text-xs font-medium'>
                                            <span>Multiple</span>
                                            <span>Ticket ID: {(ticket as UserGame).$id}</span>
                                        </p>
            
                                        <p className='flex flex-col justify-between text-color-30 text-xs'>
                                            <span>won</span>
                                            <span>{(ticket as UserGame).date}</span>
                                        </p>
                                    </div>
            
                                    {(ticket as UserGame).games.map((game, index) => {
                                        return (
                                            <div 
                                                key={index} 
                                                className='px-3 py-1 border-b border-gray-300 relative'
                                            >
                                                <div className='flex items-center relative gap-2'>
                                                    <p className='text-left text-color-60 text-xs text-wrap'>{game.home}</p>
                                                    <span className='text-color-60 text-xs'>vs</span>
                                                    <p className='text-right text-color-60 text-xs text-wrap'>{game.away}</p>
                                                </div>

                                                <p className='flex items-center gap-3 text-gray-400 text-xs'>Correct score</p>

                                                <p className='text-color-60 text-[10px] font-semibold flex justify-between'>{game.homeGoal} - {game.awayGoal}
                                                    <span>{game.odd}</span>
                                                </p>

                                                <p className='text-green-400 text-[11px] font-semibold'>won</p> 

                                                <p className='text-[10px] text-gray-400'>{game.matchTime}</p>
                                            </div>
                                        )
                                    })}
            
                                    <div className='px-3 py-3 rounded-b-md'>
                                        <p className='flex justify-between text-color-60 text-xs'>
                                            <span>Total Odds</span> 
                                            <span>{(ticket as UserGame).totalOdds}</span>
                                        </p>
            
                                        <p className='flex justify-between text-color-60 text-xs'>
                                            <span>Stake</span> 
                                            <span>${formatAmount((ticket as UserGame).stake)}</span>
                                        </p>
            
                                        <p className='flex justify-between text-color-60 text-xs'>
                                            <span>Payout:</span> 
                                            <span>${formatAmount((ticket as UserGame).payout)}</span>
                                        </p>
                                    </div>
                                </div>
            
                                <Button
                                    type='button'
                                    className='w-[90%] h-7 bg-light-gradient-135deg text-xs rounded-full mx-auto'
                                    onClick={() => setTicket('')}
                                >
                                    Clear
                                </Button>
                            </div>
                        )}
                            
                    </div>
                </div>
            )}



            {type === 'Bets' && (
                <div
                    className={`bets ${
                        selectedLink === 'Bets' ? 'flex' : 'hidden'
                    }`}
                    onClick={() => setSelectedLink('Home')}
                >
                    <div
                        className='w-[300px] h-[400px] py-5 bg-color-30 rounded-md px-3'
                    >
                        <Image
                            src='/close.svg'
                            width={25}
                            height={25}
                            alt='close icon'
                            className='absolute top-5 right-5'
                            onClick={() => setSelectedLink('Home')}
                        />
                        {openBet !== undefined ? (
                            <div 
                                className='bg-gray-300 rounded-md animate-pulse h-auto overflow-hidden cursor-pointer w-full drop-shadow-md'
                            >
                                <div className='bg-gray-200 px-5 py-2 rounded-t-md flex justify-between'>
                                    <p className='w-24 h-8 bg-gray-300 rounded-md'></p>
        
                                    <p className='w-16 h-8 bg-gray-300 rounded-md'>
                                    </p>
                                </div>
        
                                {openBet.games.map(game => {
                                    return (
                                        <div 
                                            key={game.$id}
                                            className='bg-gray-300 h-20 border-b border-color-60'
                                        >
                                            <div className='flex items-center justify-between py-1 px-5 mb-1 relative'>
                                                <p className='bg-gray-200 h-4 w-20 rounded-md'></p>
                                                <span className='bg-gray-200 h-2 w-2'></span>
                                                <p className='bg-gray-200 h-4 w-20 rounded-md'></p>
                                            </div>
        
                                            <div className='py-1 px-5'>
                                                <p className='flex items-center justify-between'>
                                                    <span className='bg-gray-200 h-4 w-20 rounded-md'></span> 
                                                    <span className='bg-gray-200 h-4 w-20 rounded-md'></span>
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
        
                                <div className='px-5 py-3 rounded-b-md flex flex-col gap-1 bg-gray-200'>
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
                        ) : (
                            <div className='flex justify-center items-center w-full h-full'>
                                <p className='text-color-60 font-medium'>No bets</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default MobileBets