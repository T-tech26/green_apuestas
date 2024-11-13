'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormMessage } from './ui/form';
import FormButton from './FormButton';
import { Input } from './ui/input';

interface BetsProps {
    selectedLink: string | null;
    setSelectedLink: (link: string) => void;
    type: string;
}

const MobileBets = ({ selectedLink, setSelectedLink, type }: BetsProps) => {

    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        betId: z.string().min(6, {
            message: "Betslip code must be 6 digits"
        }).max(6, {
            message: "Betslip code must be 6 digits"
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            betId: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setIsLoading(true)
        console.log(values)
        form.reset();
        setIsLoading(false)
    }

    return (
        <>
            {type === 'Betslip' && (
                <div
                    className={`absolute top-0 bottom-0 w-full h-auto flex-col justify-center items-center bg-light-gradient-135deg pt-5 cursor-pointer md:hidden ${
                        selectedLink === 'Betslips' ? 'flex' : 'hidden'
                    }`}
                >
                    <div
                        className='w-[300px] h-[400px] flex justify-center items-center bg-color-30'
                    >
                        <Image
                            src='/close.svg'
                            width={25}
                            height={25}
                            alt='close icon'
                            className='absolute top-5 right-5'
                            onClick={() => setSelectedLink('Home')}
                        />
                        
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                            
                            <div className="h-auto flex flex-col justify-center item-center gap-3">
        
                            <FormField
                                control={form.control}
                                name='betId'
                                render={({ field }) => (
                                    <div className='flex flex-col gap-2 w-full'>
                                        <FormControl>
                                            <Input
                                            placeholder='234187'
                                            {...field}
                                            className='py-3 px-3 placeholder:text-color-60 text-sm rounded-lg drop-shadow-sm focus:border-none focus:outline-none'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />
        
                                <FormButton loading={isLoading} text='Get slip'/>
        
                            </div>
                            </form>
                        </Form>
                    </div>
                </div>
            )}

            {type === 'Bets' && (
                <div
                    className={`absolute top-0 bottom-0 w-full h-auto flex-col justify-center items-center bg-light-gradient-135deg pt-5 cursor-pointer md:hidden ${
                        selectedLink === 'Bets' ? 'flex' : 'hidden'
                    }`}
                    onClick={() => setSelectedLink('Home')}
                >
                    <div
                        className='w-[300px] h-[400px] flex justify-center items-center bg-color-30'
                    >
                        <Image
                            src='/close.svg'
                            width={25}
                            height={25}
                            alt='close icon'
                            className='absolute top-5 right-5'
                            onClick={() => setSelectedLink('Home')}
                        />
                        <p className='text-color-60'>No bets</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default MobileBets