'use client'

import { sendVerificationEmail, updateUserProfile } from '@/lib/actions/userActions';
import { UserData } from '@/types/globals'
import React, { useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@/contexts/child_context/userContext';

interface EmailFormProps {
    user: UserData | string,
}

const EmailForm = ({ user }: EmailFormProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [edit, setEdit] = useState(true);
    const [type, setType] = useState('');

    const { loginUser } = useUser();
    
    const userData = {
        email: (user as UserData)?.email,
    }

    const emailSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
    })

    // 1. Define your form.
    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
          email: userData.email,
          password: ''
        },
    })



    const verifyEmail = async () => {
        setIsLoading(true);
        try {
            const response = await sendVerificationEmail();

            if(response !== 'success') {
                toast({
                    description: response
                })
                return;
            }
            
            if(response === 'success') {
                toast({
                    description: 'An email will be sent from appwrite to your email address'
                });
            }
        } catch (error) {
            console.log('Error verifying email', error);
        } finally {
            setIsLoading(false);
        }
    }
  
  
    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof emailSchema>) => {
        
        setIsLoading(true)
        try {

            const { email, password } = values;
            const id = (user as UserData)?.$id;
            const response = await updateUserProfile('email', email, id, password);
            if(typeof response === 'string') {
                toast({
                description: response
                })
                return;
            }

            toast({ description: 'Email updated' });
            
            if(typeof response === 'object' && typeof response !== null) {
                loginUser();
            }
            setEdit(false);
            
        } catch (error) {
            console.error("Error submitting activation code ", error);
        } finally {
            setIsLoading(false)
            form.setValue('password', '');
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
                                        className={`flex items-center justify-between text-xs rounded-full pl-2 pr-6 py-[2px] ${
                                            (user as UserData)?.email_verified ? 'bg-green-50 text-green-300' : 'text-red-300 bg-red-50'
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

                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <div className='flex flex-col gap-1'>
                                <p className='text-color-60 text-sm'>Enter your password to update your email</p>
                                <FormControl>
                                    <Input
                                        id='password'
                                        type='password'
                                        className={`w-full px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none focus:border-color-10`}
                                        { ...field }
                                    />
                                </FormControl>
                            </div>
                        )}
                    />


                    <div className='self-end flex gap-2'>
                        <Button type='submit' 
                            disabled={isLoading && type === 'update'}
                            className='bg-light-gradient-135deg text-xs text-color-30 rounded-full self-end h-7 px-8'
                            onClick={() => setType('update')}
                        >
                            {isLoading && type === 'update' ? 'Loading' : 'Update'}
                        </Button>
                        <Button type='button' 
                            disabled={isLoading && type === 'verifiy'}
                            className='bg-light-gradient-135deg text-xs text-color-30 rounded-full self-end h-7 px-6'
                            onClick={() => {
                                setType('verify');
                                verifyEmail();
                            }}
                        >
                            {isLoading && type === 'verify' ? 'Loading' : 'Verify email'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default EmailForm