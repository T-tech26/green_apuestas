'use client'
import PaymentMethod from '@/components/PaymentMethod'
import { Button } from '@/components/ui/button'
import { PaymentMethods } from '@/constants'
import React, { useState } from 'react'

const Deposit = () => {


    const [paymentMethod, setPaymentMethod] = useState('1');


    return (
        <main className='flex-1 py-14 overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-5'>
                <h1 className='text-lg text-color-60 font-medium'>Deposit</h1>

                <div
                    className='flex items-center flex-wrap py-3'
                >
                    {PaymentMethods.map(method => {

                    const active = paymentMethod === method.id;

                    return (
                        <Button 
                        key={method.id}
                        type='button'
                        className={`rounded-none bg-dark-gradient-135deg hover:bg-light-gradient-135deg focus:outline-none outline-none
                            ${
                            active ? 'bg-light-gradient-135deg' : ''
                            }`}
                            onClick={() => setPaymentMethod(method.id)}
                        >
                        {method.description}
                        </Button>
                    )
                    })}
                </div>

                <PaymentMethod id={paymentMethod} />
            </div>
        </main>
    )
}

export default Deposit