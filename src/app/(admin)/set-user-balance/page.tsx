'use client'
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { setBalance } from '@/lib/actions/userActions';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react'


const UserBalance = () => {

    const params = useSearchParams();
    
    const addBalance = params.get('add');
    const userId = params.get('id');

    const [addAmount, setAddAmount] = useState('');
    const [subtractAmount, setSubtractAmount] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSetBalance = async (amount: string, action: string) => {
        setLoading(true);
        try {
            if(userId !== null) {
                const response = await setBalance(amount, userId, action);
    
                if(response !== 'success') {
                    toast({
                        description: response
                    })
                } else {
                    toast({
                        description: 'Balance set for user'
                    })
                }
            }
        } catch (error) {
           toast({
                description: 'Something unexpected happened! try again'
           });
           console.error('Error setting user balance', error);
        } finally {
            if(action === 'add') { setAddAmount('') }
            if(action === 'subtract') { setSubtractAmount('') }
            setLoading(false);
        }
    }


    if(addBalance === 'true') {
        return (
            <main className='flex-1 py-14 overflow-x-hidden overflow-y-scroll'>
                <div className='w-4/5 mx-auto flex flex-col gap-10'>
                    <h1 className='text-lg text-color-60 font-medium uppercase'>Set user balance</h1>

                    <div className='flex flex-col md:flex-row gap-5'>
                        <input 
                            type="text" 
                            placeholder='Add balance'
                            className='text-sm border rounded-md px-3 w-full focus:border-color-10 outline-none'
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                        />

                        <Button
                            type='button'
                            disabled={loading}
                            className='bg-light-gradient-135deg text-sm rounded-full text-color-30 py-2 text-center'
                            onClick={() => handleSetBalance(addAmount, 'add')}
                        >
                            Add balance
                        </Button>
                    </div>
                </div>
            </main>
        )
    }


    return (
        <main className='flex-1 py-14 overflow-x-hidden overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-10'>
                <h1 className='text-lg text-color-60 font-medium uppercase'>Set user balance</h1>

                <div className='flex flex-col md:flex-row gap-5'>
                    <input 
                        type="text" 
                        placeholder='Subtract balance'
                        className='text-sm border rounded-md px-3 w-full focus:border-color-10 outline-none'
                        value={subtractAmount}
                        onChange={(e) => setSubtractAmount(e.target.value)}
                    />

                    <Button
                        type='button'
                        disabled={loading}
                        className='bg-light-gradient-135deg text-sm rounded-full text-color-30 py-2 text-center'
                        onClick={() => handleSetBalance(subtractAmount, 'subtract')}
                    >
                        Subtract balance
                    </Button>
                </div>
            </div>
        </main>
    )
}

const Page = () => {
  return (
    <Suspense fallback={<p>Loading....</p>}>
      <UserBalance />
    </Suspense>
  );
}

export default Page