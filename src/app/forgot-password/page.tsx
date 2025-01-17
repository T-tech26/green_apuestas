'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { updatePassword } from '@/lib/actions/userActions';
import { Loader2 } from 'lucide-react';
import { redirect, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react'

const ForgotPassword = () => {

    const params = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [password, setPassword] = useState('');

    const secret = params.get('secret');
    const userId = params.get('userId');


    useEffect(() => {
        if (success) {
            redirect('/signin'); // Redirect once email is verified
        }
    }, [success]);


    const resetPassword = async () => {
        setIsLoading(true);
        try {
            
            if (!secret || !userId) { toast({ description: 'An unknown error occurred' }); return; }

            if(!password) { toast({ description: 'Enter new password' }); return; }

            const update = await updatePassword(secret, userId, password);
            
            if(update !== 'success') { toast({ description: update }); return; }

            toast({ description: 'Password reset successful' });

            setSuccess(true);
        } catch (error) {
            console.log("Error reseting password", error);
            toast({
                description: 'Error reseting password'
            });
        } finally {
            setIsLoading(false);
            setPassword('');
        }
    };

    return (
        <section className='w-full h-screen grid place-items-center'>
            <div className='text-center w-4/5 md:w-3/5 py-9 rounded-md drop-shadow-lg bg-color-30 px-10'>
                <h1 className='text-color-60 mb-4'>Enter new password</h1>

                <Input 
                    id='password'
                    type='password'
                    value={password}
                    placeholder='Enter verification pin'
                    className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm text-sm flex-1 mb-5'
                    onChange={e => setPassword(e.target.value)}
                />


                <Button
                    type='button'
                    disabled={isLoading}
                    className='bg-light-gradient-135deg text-sm text-color-30 rounded-full self-end h-10 px-6'
                    onClick={() => resetPassword()}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className='animate-spin'/> &nbsp; 
                            Loading...
                        </>
                    ): 'Reset password'}
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
            <ForgotPassword />
        </Suspense>
    );
}

export default SuspenseWrapper;