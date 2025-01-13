'use client'
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { verifyUserEmail } from '@/lib/actions/userActions';
import { createSessionClient } from '@/lib/appwrite/config';
import { Loader2 } from 'lucide-react';
import { redirect, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

const VerifyEmail = () => {

    const params = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);

    const secret = params.get('secret');
    const userId = params.get('userId');

    const emailVerification = async () => {
        setIsLoading(true);
        try {
            
            if(!secret || !userId) {
                toast({
                    description: 'An unknown error occured'
                });
                return;
            }

            await verifyUserEmail(secret, userId);
            
            toast({
                description: 'Email verified'
            });

            redirect('/login');
        } catch (error) {
            console.log("Error verifying user email", error);
            toast({
                description: 'Error verifying email'
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <section className='w-full h-screen grid place-items-center'>
            <div className='text-center w-4/5 md:w-3/5 py-9 rounded-md drop-shadow-lg bg-color-30'>
                <h1 className='text-color-60 mb-4'>Click the button to verify your email</h1>
                <Button
                    type='button'
                    disabled={isLoading}
                    className='bg-light-gradient-135deg text-sm text-color-30 rounded-full self-end h-10 px-6'
                    onClick={() => emailVerification()}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className='animate-spin'/> &nbsp; 
                            Loading...
                        </>
                    ): 'Verify Email'}
                </Button>
            </div>
        </section>
    )
}

export default VerifyEmail