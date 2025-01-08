import { UserData, UserGame } from '@/types/globals'
import React, { useState } from 'react'
import Image from 'next/image'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { getGameTickets, updateGameTicket } from '@/lib/actions/userActions'
import { toast } from '@/hooks/use-toast'
import { useUserSlipContext } from '@/contexts/child_context/userSlipContext'


interface UserWithSlip {
    slip: UserGame,
    user: UserData,
}


interface EditUserTicketProps {
    ticket: UserWithSlip | string,
    setTicket: (newTicket: string) => void
}


const EditUserTicket = ({ ticket, setTicket }: EditUserTicketProps) => {
    
    const ticketData = (ticket as UserWithSlip);

    const { setUserSlips } = useUserSlipContext();

    const [isLoading, setIsLoading] = useState(false);


    // 2. Define a submit handler.
    const onSubmit = async (slip: UserGame) => {
        
        setIsLoading(true)
        try {
            const res = await updateGameTicket(slip);

            if(res !== 'success') {
                toast({
                    description: res
                });
                return;
            }

            if(res === 'success') {
                toast({
                    description: 'Ticket updated'
                });
            }
            
            const gameTickets = await getGameTickets();
                            
            if(typeof gameTickets === 'string') return;
            setUserSlips(gameTickets);
            
        } catch (error) {
            console.error("Error submitting activation code ", error);
        } finally {
            setIsLoading(false);
            setTicket('')
        }
    }


    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-color-60 bg-opacity-30 overflow-y-scroll grid place-items-center py-14'>
            <div className='w-[95%] md:w-4/5 bg-color-30 rounded-md p-10 relative'>
                <Image 
                    src='/close.svg'
                    width={25}
                    height={25}
                    alt='Close icon'
                    className='absolute -top-[30px] -right-[10px] cursor-pointer'
                    onClick={() => setTicket('')}
                />


                <div className='flex flex-col gap-2'>
                    {ticketData.slip.games.map((ticket) => {
                        return (
                            <div 
                                key={ticket.$id}
                                className='flex flex-col py-3 gap-1'
                            >
                                <div className='flex items-center gap-3'>
                                    <Input 
                                        id={ticket.home}
                                        type='text'
                                        className={`w-full px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none focus:border-color-10`}
                                        defaultValue={ticket.home}
                                        onChange={e => ticket.home = e.target.value}
                                    />

                                    <p>vs</p>

                                    <Input 
                                        id={ticket.away}
                                        type='text'
                                        className={`w-full px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none focus:border-color-10`}
                                        defaultValue={ticket.away}
                                        onChange={e => ticket.away = e.target.value}
                                    />
                                </div>
                                
                                <p>Correct score</p>

                                <div className='flex items-center justify-between gap-3'>
                                    <div className='flex items-center gap-3'>
                                        <Input 
                                            id={ticket.homeGoal}
                                            type='text'
                                            className={`w-[50px] px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none focus:border-color-10`}
                                            defaultValue={ticket.homeGoal}
                                            onChange={e => ticket.homeGoal = e.target.value}
                                        />

                                        <p>-</p>

                                        <Input 
                                            id={ticket.awayGoal}
                                            type='text'
                                            className={`w-[50px] px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none focus:border-color-10`}
                                            defaultValue={ticket.awayGoal}
                                            onChange={e => ticket.awayGoal = e.target.value}
                                        />
                                    </div>

                                    <Input 
                                        id={ticket.odd}
                                        type='text'
                                        className={`w-[50px] px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none focus:border-color-10`}
                                        defaultValue={ticket.odd}
                                        onChange={e => ticket.odd = e.target.value}
                                    />
                                </div>

                                <Input 
                                    id={ticket.matchTime}
                                    type='text'
                                    className={`w-full px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none focus:border-color-10 mt-2`}
                                    defaultValue={ticket.matchTime}
                                    onChange={e => ticket.matchTime = e.target.value}
                                />
                            </div>
                        )
                    })}

                    <p className='h-[1px] bg-color-60 w-full rounded-md mb-3'></p>

                    <div className='flex items-center justify-between'>
                        <p>Total odds</p>
                        <Input 
                            id={ticketData.slip.totalOdds}
                            type='text'
                            className={`w-[100px] px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none focus:border-color-10`}
                            defaultValue={ticketData.slip.totalOdds}
                            onChange={e => ticketData.slip.totalOdds = e.target.value}
                        />
                    </div>

                    <div className='flex items-center justify-between'>
                        <p>Stake</p>
                        <Input 
                            id={ticketData.slip.stake}
                            type='text'
                            className={`w-[100px] px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none focus:border-color-10`}
                            defaultValue={ticketData.slip.stake}
                            onChange={e => ticketData.slip.stake = e.target.value}
                        />
                    </div>

                    <div className='flex items-center justify-between'>
                        <p>Payout</p>
                        <Input 
                            id={ticketData.slip.payout}
                            type='text'
                            className={`w-[100px] px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none focus:border-color-10`}
                            defaultValue={ticketData.slip.payout}
                            onChange={e => ticketData.slip.payout = e.target.value}
                        />
                    </div>
                </div>

                <Button type='button' 
                    disabled={isLoading}
                    className='bg-light-gradient-135deg text-xs text-color-30 rounded-full self-end h-7 px-8'
                    onClick={() => onSubmit(ticketData.slip)}
                >
                    {isLoading ? (
                    <>
                        <Loader2 size={20} className='animate-spin'/> &nbsp; 
                        Loading...
                    </>
                    ): 'Update'}
                </Button>
            </div>
        </div>
    )
}

export default EditUserTicket