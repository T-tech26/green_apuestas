'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input';
import { useUser } from '@/contexts/child_context/userContext';
import { UserData, UserGame } from '@/types/globals';
import { formatAmount } from '@/lib/utils';
import { useUserSlipContext } from '@/contexts/child_context/userSlipContext';

const Bets = () => {

  const { user } = useUser();
  const { userSlips } = useUserSlipContext();

  const [selectedButton, setSelectedButton] = useState<string | null>('Open Bets');
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
    <aside
      className='w-[281px] lg:flex justify-center items-center bg-light-gradient-180deg-reverse px-3 py-8 hidden h-[550px]'
    >
      <div
        className='bg-color-30 rounded-t-lg h-full w-full'
      >
        <div className='w-full'>
          <Button
            type='button'
            className={`bg-color-60 text-color-30 rounded-br-none rounded-bl-none rounded-tr-none rounded-tl-lg border-b-2 border-color-10 w-1/2 hover:bg-color-60 focus:outline-none focus:border-none ${
              selectedButton === 'Betslip' ? 'bg-color-30 hover:bg-color-30 text-color-60' : ''
            }`}
            onClick={() => setSelectedButton('Betslip')}
          >
            Betslip
          </Button>

          <Button
            type='button'
            className={`bg-color-60 text-color-30 rounded-br-none rounded-bl-none rounded-tl-none rounded-tr-lg border-b-2 border-color-10 w-1/2 hover:bg-color-60 focus:outline-none focus:border-none ${
              selectedButton === 'Open Bets' ? 'bg-color-30 hover:bg-color-30 text-color-60' : ''
            }`}
            onClick={() => setSelectedButton('Open Bets')}
          >
            Open Bets
          </Button>
        </div>

        <div
          className={`flex flex-col h-full px-1 py-3 relative`}
        >
          {
            selectedButton === 'Open Bets' && (
              <>
                {openBet !== undefined ? (
                  <div 
                      className='bg-gray-300 rounded-md animate-pulse h-auto overflow-hidden cursor-pointer w-full'
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
              </>
            )
          }
          
          {
            selectedButton === 'Betslip' && (
              <>
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
                  <p className='text-color-60 font-medium'>No ticket with ticket ID:{value}</p>
                ) : (
                  <div className='flex flex-col gap-6'>
                    <div 
                        className='bg-color-30 rounded-md h-auto overflow-hidden cursor-pointer drop-shadow-md'
                    >
                        <div className='bg-light-gradient-135deg px-3 py-1 rounded-t-md flex justify-between'>
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
              </>
            )    
          }
        </div>
      </div>
    </aside>
  )
}

export default Bets