import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import LiveChat from './LiveChat'
import { toast } from '@/hooks/use-toast'
import { activateSubscription } from '@/lib/actions/userActions'
import { useUser } from '@/contexts/child_context/userContext'
import { UserData } from '@/types/globals'


interface AllowVerificationProps {
    id: string,
    type: string,
    setCheckBilling?: (newBilling: boolean) => void,
}


const AllowVerification = ({ id, type, setCheckBilling }: AllowVerificationProps) => {

    const { user, loginUser } = useUser();

    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);


    if((user as UserData).chargesPaid && (user as UserData).premiumCard && setCheckBilling) { setCheckBilling(false); }


    
    const handleAllowVerification = async (userId: string) => {
        setLoading(true);
        try {
            if(pin === '') {
                toast({
                    description: 'Please enter pin'
                });
                return;
            }

            const verificationType = type === 'verification' ? 'allow verification' : !(user as UserData).chargesPaid ? 'charges' : !(user as UserData).premiumCard ? 'premium card' : '';

            const allow = await activateSubscription(userId, pin, verificationType);

            if(typeof allow === 'string') {
                toast({
                    description: allow
                });
                return;
            }
            
            loginUser();
        } catch (error) {
            console.error('Error submitting pin', error);
        } finally {
            setPin('');
            setLoading(false);
        }
    }


    return (
        <main className='fixed top-0 right-0 left-0 bottom-0 bg-color-60 bg-opacity-30 overflow-y-scroll grid place-items-center py-14'>
            <div 
                className='relative w-[95%] md:w-4/5 md:max-w-[700px] bg-color-30 rounded-md flex flex-col gap-5 justify-between p-5'
            >
                {type === 'verification' && (
                    <p className='text-color-60 text-sm'>
                        Contact support to get pin for <span className='font-semibold'>accout verification.</span>
                    </p>
                )}

                {type === '' && !(user as UserData).chargesPaid && (
                    <p className='text-color-60 text-sm'>
                        <span className='font-semibold'>Withdrawal charges pin.</span>
                    </p>
                )}

                {(user as UserData).chargesPaid && !(user as UserData).premiumCard && (
                    <p className='text-color-60 text-sm'>
                        <span className='font-semibold'>Premium card pin.</span>
                    </p>
                )}

                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <Input 
                        id='verification code'
                        type='text'
                        value={pin}
                        placeholder='Enter verification pin'
                        className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm text-sm flex-1'
                        onChange={e => setPin(e.target.value)}
                    />

                    <Button
                        disabled={loading}
                        type='button'
                        className='min-w-28 h-8 bg-light-gradient-135deg text-sm text-color-30 rounded-full'
                        onClick={() => {
                            handleAllowVerification(id);
                        }}
                    >
                        {loading ? 'Loading' : 'Submit'}
                    </Button>
                </div>
            </div>

            <LiveChat />
        </main>
    )
}

export default AllowVerification