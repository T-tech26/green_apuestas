'use client'

import { sendVerificationEmail } from '@/lib/actions/userActions';
import { UserData } from '@/types/globals'
import React, { useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';

interface EmailFormProps {
    user: UserData | string,
}

const EmailForm = ({ user }: EmailFormProps) => {
    
    const [verifyPending, setVerifyPending] = useState(false);

    const verifyEmail = async () => {
        setVerifyPending(true);
        try {
            const response = await sendVerificationEmail();

            if(response !== 'success') {
                toast({
                    description: response
                })
                return;
            }

            toast({
                description: 'An email has been sent to your provided email address'
            });
        } catch (error) {
            console.log('Error verifying email', error);
        } finally {
            setVerifyPending(false);
        }
    }
  
  
    return (
        <div className="h-auto flex flex-col justify-center item-center gap-1">
                <div className='flex flex-col gap-1'>
                    <p className='text-color-60 text-sm font-semibold'>Email</p>
                    <div className='flex items-center gap-2'>
                        <Input
                            id='email'
                            type='email'
                            className={`w-full px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none bg-color-30`}
                            defaultValue={(user as UserData).email}
                        />

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

            <div className='self-end flex gap-2'>
                <Button type='button' 
                    disabled={verifyPending}
                    className='bg-light-gradient-135deg text-xs text-color-30 rounded-full self-end h-7 px-6'
                    onClick={() => verifyEmail()}
                >
                    {verifyPending ? (
                    <>
                        <Loader2 size={20} className='animate-spin'/> &nbsp; 
                        Loading...
                    </>
                    ): 'Verify email'}
                </Button>
            </div>

        </div>
    )
}

export default EmailForm