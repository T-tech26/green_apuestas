'use client'
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { verifyUserEmail } from '@/lib/actions/userActions';
import { Loader2 } from 'lucide-react';
import { redirect, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'

const VerifyEmail = () => {

    const params = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const secret = params.get('secret');
    const userId = params.get('userId');


    useEffect(() => {
        if (isVerified) {
            redirect('/signin'); // Redirect once email is verified
        }
    }, [isVerified]);


    const emailVerification = async () => {
        setIsLoading(true);
        try {
            
            if (!secret || !userId) {
                toast({
                    description: 'An unknown error occurred'
                });
                return;
            }

            await verifyUserEmail(secret, userId);
            
            toast({
                description: 'Email verified'
            });

            setIsVerified(true);
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


const Loading = () => {
    return (
        <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-dark-gradient-135deg flex justify-center items-center">
          <Loader2 size={60} className="animate-spin text-color-30" />
        </div>
    )
}

// Wrap your page component inside Suspense
const SuspenseWrapper = () => {
    return (
        <Suspense fallback={<Loading />}>
            <VerifyEmail />
        </Suspense>
    );
}

export default SuspenseWrapper;
