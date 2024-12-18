'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormMessage } from '@/components/ui/form';
import { UserData } from '@/types/globals';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { z } from 'zod';
import { useUser } from '@/contexts/child_context/userContext';
import { stakeUserBet } from '@/lib/actions/userActions';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import UserBetUpload from '@/components/UserBetUpload';



const StakeBets = () => {

    const { allUsers } = useUser()

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('stake');


    const formSchema = z.object({
        userId: z.string().min(3),
    });


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: '',
        }
    });


    const onSubmit = async (data: z.infer<typeof formSchema>) => {

        setLoading(true);
        try {
            const response = await stakeUserBet(data.userId);

            if(response === 'success') {
                toast({
                    description: 'User notified'
                })
            }

            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (error: any) {
            /* eslint-enable @typescript-eslint/no-explicit-any */
            console.error("Error creating user bet ticket", error);
        } finally {
            setLoading(false);
            form.reset();
        }
    }
    

    return (
        <main className='flex-1 py-14 overflow-x-hidden overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-10'>
                <h1 className='text-lg text-color-60 font-medium'>User Bets</h1>


                <div
                    className='flex items-center flex-wrap py-3'
                >
                    <Button 
                        type='button'
                        className={`rounded-none bg-dark-gradient-135deg hover:bg-light-gradient-135deg focus:outline-none outline-none focus:border-none
                            ${
                                status === 'stake' ? 'bg-light-gradient-135deg' : ''
                            }`}
                        onClick={() => setStatus('stake')}
                    >
                        Place user bet
                    </Button>

                    <Button 
                        type='button'
                        className={`rounded-none bg-dark-gradient-135deg hover:bg-light-gradient-135deg focus:outline-none outline-none focus:border-none
                            ${
                                status === 'upload' ? 'bg-light-gradient-135deg' : ''
                            }`}
                        onClick={() => setStatus('upload')}
                    >
                        Upload user slip
                    </Button>
                </div>


                {status === 'stake' && (
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                
                                <div className='flex flex-col gap-3'>
                                    <h2 className='text-color-60 text-base font-semibold'>Stake bet for user</h2>

                                    <p className='text-color-60 text-sm'>Just select a user and click stake bet</p>

                                    <FormField
                                        control={form.control}
                                        name="userId"
                                        render={({ field }) => (
                                        <div className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm placeholder:text-gray-200 flex items-center justify-between'>
                                                <SelectValue placeholder="Select user to bet for" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className=''>
                                                {(allUsers as UserData[]).length > 0 && (allUsers as UserData[]).map(user => {
                                                return (
                                                    <SelectItem className='cursor-pointer' key={user.$id} value={user.userId}>
                                                        {user.firstname} {user.lastname}
                                                    </SelectItem>
                                                )
                                                })}
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </div>
                                        )}
                                    />

                                    <Button type='submit' 
                                        disabled={loading}
                                        className='w-full bg-light-gradient-135deg text-sm text-color-30 rounded-full'
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={20} className='animate-spin'/>&nbsp; 
                                                Loading...
                                            </>
                                        ): 'Stake bet'}
                                    </Button>
                                </div>
                            </form>
                        </Form> 
                    </div>
                )}

                {status === 'upload' && (
                    <UserBetUpload />
                )}
            </div>

        </main>
    )
}

export default StakeBets