'use client'
import BankPayment from '@/components/BankPayment'
import BinanceID from '@/components/BinanceID'
import CryptoPayment from '@/components/CryptoPayment'
import IntlPayment from '@/components/IntlPayment'
import { Button } from '@/components/ui/button'
import { PaymentMethods } from '@/constants'
import React, { useState } from 'react'

const PaymentMethod = () => {

  const [paymentMethod, setPaymentMethod] = useState('1');

    return (
        <main className='flex-1 py-14 overflow-x-hidden overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-10'>
                <h1 className='text-lg text-color-60 font-medium'>Payment Methods</h1>

                <div>
                    <h2 className='text-sm text-color-60'>Upload payment methods</h2>

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

                    {paymentMethod === '1' && (
                      <BinanceID />
                    )}

                    {paymentMethod === '2' && (
                      <CryptoPayment />
                    )}

                    {paymentMethod === '3' && (
                      <BankPayment />
                    )}

                    {paymentMethod === '4' && (
                      <IntlPayment />
                    )}
                </div>
            </div>
        </main>
    )
}

export default PaymentMethod