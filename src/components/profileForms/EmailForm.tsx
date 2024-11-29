'use client'

import { updateUserProfile } from '@/lib/actions/userActions';
import { emailSchema } from '@/lib/utils';
import { UserData } from '@/types/globals'
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';

interface EmailFormProps {
    user: UserData | string,
    setUser: (user: UserData | string) => void
}

const EmailForm = ({ user, setUser }: EmailFormProps) => {
    
    const [isLoading, setIsLoading] = useState(false);
    const [edit, setEdit] = useState(true);
    

    const userData = {
        email: (user as UserData)?.email,
    }


    // 1. Define your form.
    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
          email: userData.email,
        },
    })
  
  
  
    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof emailSchema>) => {
        
        setIsLoading(true)
        try {

            const { email } = values;

            const id = (user as UserData)?.$id;

            const response = await updateUserProfile('email', email, id);

            if(typeof response === 'string') {
                toast({
                description: response
                })
            }
            
            if(typeof response === 'object' && typeof response !== null) setUser(response);
            
        } catch (error) {
            console.error("Error submitting activation code ", error);
        } finally {
            setIsLoading(false)
        }
    }
  
  
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            
            <div className="h-auto flex flex-col justify-center item-center gap-1">

                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (

                        <div className='flex flex-col gap-1'>
                            <FormLabel className='text-color-60 text-sm'>Email</FormLabel>
                            <div className='flex items-center gap-2'>
                                <div className='flex gap-2 w-full relative'>
                                    <FormControl>
                                        <Input
                                            id='email'
                                            type='email'
                                            className={`w-full px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none ${
                                                edit ? '' : 'border-color-10'
                                            }`}
                                            disabled={edit}
                                            { ...field }
                                        />
                                    </FormControl>

                                    <Image
                                        src='/edit-icon.svg'
                                        width={20}
                                        height={20}
                                        alt='edit icon'
                                        className='absolute top-[25%] right-2 cursor-pointer'
                                        onClick={() => setEdit(!edit)}
                                    />
                                </div>

                                <p
                                    className={`flex items-center justify-between text-xs text-red-300 rounded-full pl-2 pr-6 py-[2px] bg-red-50 ${
                                        (user as UserData)?.email_verified ? 'bg-green-300 text-green-300' : ''
                                    }`}
                                >
                                    <Image
                                        src={`${(user as UserData)?.email_verified ? '/green-dot-icon.svg' : '/red-dot-icon.svg'}`}
                                        width={10}
                                        height={10}
                                        alt='dot icon'
                                    />

                                    {(user as UserData)?.email_verified ? 'Verified' : 'Unverified'}
                                </p>
                            </div>
                        </div>
                    )}
                />

                <div className='self-end flex gap-2'>
                    <Button type='submit' 
                        disabled={isLoading}
                        className='bg-light-gradient-135deg text-xs text-color-30 rounded-full self-end h-7 px-8'
                    >
                        {isLoading ? (
                        <>
                            <Loader2 size={20} className='animate-spin'/> &nbsp; 
                            Loading...
                        </>
                        ): 'Update'}
                    </Button>

                    <Button type='button' 
                        disabled={isLoading}
                        className='bg-light-gradient-135deg text-xs text-color-30 rounded-full self-end h-7 px-6'
                    >
                        Verify email
                    </Button>
                </div>

            </div>
            </form>
        </Form>
    )
}

export default EmailForm