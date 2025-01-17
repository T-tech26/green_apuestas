'use client'
import { PaymentMethods } from '@/types/globals';
import React, { useEffect, useState } from 'react'
import PaymentProcess from './PaymentProcess';
import { formatAmount } from '@/lib/utils';
import { useTransactionContext } from '@/contexts/child_context/transactionContext';


interface PaymentMethodProps {
    id: string
}

const PaymentMethod = ({ id }: PaymentMethodProps) => {

    const { paymentMethods, getAllPaymentMethods, paymentMethodsLoading, setPaymentMethodsLoading } = useTransactionContext();

    const [type, setType] = useState<PaymentMethods[] | string>('');
    const [method, setMethod] = useState<PaymentMethods | string>('');
    

    useEffect(() => {
        if(id === '1') {
            if(paymentMethods.length > 0) {
                const cryptoType = paymentMethods.filter(methods => {  return methods.payId; });
                setType(cryptoType);
                setPaymentMethodsLoading(false);
            }
        }
        if(id === '2') {
            if(paymentMethods.length > 0) {
                const cryptoType = paymentMethods.filter(methods => {  return methods.cryptoName; });
                setType(cryptoType);
                setPaymentMethodsLoading(false);
            }
        }
        if(id === '3') {
            if(paymentMethods.length > 0) {
                const cryptoType = paymentMethods.filter(methods => {  return methods.bankName; });
                setType(cryptoType);
                setPaymentMethodsLoading(false);
            }
        }
        if(id === '4') {
            if(paymentMethods.length > 0) {
                const cryptoType = paymentMethods.filter(methods => {  return methods.email; });
                setType(cryptoType);
                setPaymentMethodsLoading(false);
            }
        }
    }, [paymentMethods, id]);

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if(!paymentMethods.length) { 
            getAllPaymentMethods();
        }
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    

    if(id === '4') {
        return (
            <main className='py-7'>
                {Array.isArray(type) && type.length > 0 ? (
                    <div className='overflow-x-scroll address'>
                        {type.map((method, index) => {
                            const logo = method.logoUrl;
    
                            const isLastIndex = index === type.length - 1;
                            return (
                                <div 
                                    key={method.$id}
                                    className={`min-w-[500px] gap-5 flex items-center justify-between py-2 px-4 bg-gray-50 hover:bg-light-gradient-135deg border-b border-color-10 cursor-pointer ${
                                        index === 0 ? 'rounded-t-md' : ''
                                    } ${ isLastIndex ? 'border-none rounded-b-md' : ''}`}
                                    onClick={() => setMethod(method)}
                                >
                                    <div className='flex items-center gap-2 text-sm text-color-60'>
                                        {/* eslint-disable @next/next/no-img-element */}
                                        <img
                                            src={logo ? logo : '/profile-icon.svg'}
                                            width={30}
                                            height={30}
                                            alt='method logo'
                                            className='rounded-full size-9'
                                        />
                                        {/* eslint-enable @next/next/no-img-element */}
                                        {`${method.type}`}
                                    </div>
    
                                    <div>
                                        <p className='text-color-60 font-semibold text-sm mb-2'>Platform name</p>
                                        <p className='text-color-60 text-sm'>
                                            {`${method.platformName}`}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-color-60 font-semibold text-sm mb-2'>Minimum deposit</p>
                                        <p className='text-color-60 text-sm'>
                                            {`${method.minDeposit && formatAmount(method.minDeposit)}`}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )  : paymentMethodsLoading ? (
                    <div className="w-full animate-pulse flex flex-col gap-1">
                        <div className='w-full h-16 bg-gray-300'></div>
                        <div className='w-full h-16 bg-gray-300'></div>
                        <div className='w-full h-16 bg-gray-300'></div>
                    </div>
                ) : (
                    <div className='flex justify-center py-4'>
                        <p className='text-color-60 text-sm'>No international payment method!</p>
                    </div>
                )}
    
                <PaymentProcess method={method} setMethod={setMethod} />
            </main>
        )
    }


    if(id === '3') {
        return (
            <main className='py-7'>
                {Array.isArray(type) && type.length > 0 ? (
                    <div className='overflow-x-scroll address'>
                        {type.map((method, index) => {
                            const logo = method.logoUrl;
    
                            const isLastIndex = index === type.length - 1;
                            return (
                                <div 
                                    key={method.$id}
                                    className={`min-w-[500px] gap-5 flex items-center justify-between py-2 px-4 bg-gray-50 hover:bg-light-gradient-135deg border-b border-color-10 cursor-pointer ${
                                        index === 0 ? 'rounded-t-md' : ''
                                    } ${ isLastIndex ? 'border-none rounded-b-md' : ''}`}
                                    onClick={() => setMethod(method)}
                                >
                                    <div className='flex items-center gap-2 text-sm text-color-60'>
                                        {/* eslint-disable @next/next/no-img-element */}
                                        <img
                                            src={logo ? logo : '/profile-icon.svg'}
                                            width={30}
                                            height={30}
                                            alt='method logo'
                                            className='rounded-full size-9'
                                        />
                                        {/* eslint-enable @next/next/no-img-element */}
                                        {`${method.type}`}
                                    </div>
    
                                    <div>
                                        <p className='text-color-60 font-semibold text-sm mb-2'>Bank name</p>
                                        <p className='text-color-60 text-sm'>
                                            {`${method.bankName}`}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-color-60 font-semibold text-sm mb-2'>Bank currency</p>
                                        <p className='text-color-60 text-sm'>
                                            {`${method.currency}`}
                                        </p>
                                    </div>
    
                                    <div>
                                        <p className='text-color-60 font-semibold text-sm mb-2'>Minimum deposit</p>
                                        <p className='text-color-60 text-sm'>
                                            {`${method.minDeposit && formatAmount(method.minDeposit)}`}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )  : paymentMethodsLoading ? (
                    <div className="w-full animate-pulse flex flex-col gap-1">
                        <div className='w-full h-16 bg-gray-300'></div>
                        <div className='w-full h-16 bg-gray-300'></div>
                        <div className='w-full h-16 bg-gray-300'></div>
                    </div>
                ) : (
                    <div className='flex justify-center py-4'>
                        <p className='text-color-60 text-sm'>No Bank payment method!</p>
                    </div>
                )}
    
                <PaymentProcess method={method} setMethod={setMethod} />
            </main>
        )
    }


    if(id === '2') {
        return (
            <main className='py-7'>
                {Array.isArray(type) && type.length > 0 ? (
                    <div className='overflow-x-scroll address'>
                        {type.map((method, index) => {
                            const logo = method.logoUrl;
    
                            const isLastIndex = index === type.length - 1;
                            return (
                                <div 
                                    key={method.$id}
                                    className={`min-w-[500px] flex justify-between gap-5 items-center py-2 px-4 bg-gray-50 hover:bg-light-gradient-135deg border-b border-color-10 cursor-pointer ${
                                        index === 0 ? 'rounded-t-md' : ''
                                    } ${ isLastIndex ? 'border-none rounded-b-md' : ''}`}
                                    onClick={() => setMethod(method)}
                                >
                                    <div className='flex items-center gap-2 text-sm text-color-60'>
                                        {/* eslint-disable @next/next/no-img-element */}
                                        <img
                                            src={logo ? logo : '/profile-icon.svg'}
                                            width={30}
                                            height={30}
                                            alt='method logo'
                                            className='rounded-full size-9'
                                        />
                                        {/* eslint-enable @next/next/no-img-element */}
                                        {`${method.type}`}
                                    </div>
    
                                    <div>
                                        <p className='text-color-60 font-semibold text-sm mb-2'>Crypto</p>
                                        <p className='text-color-60 text-sm'>
                                            {`${method.cryptoName}`}
                                        </p>
                                    </div>
    
                                    <div>
                                        <p className='text-color-60 font-semibold text-sm mb-2'>Minimum deposit</p>
                                        <p className='text-color-60 text-sm'>
                                            {`${method.minDeposit && formatAmount(method.minDeposit)}`}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )  : paymentMethodsLoading ? (
                    <div className="w-full animate-pulse flex flex-col gap-1">
                        <div className='w-full h-16 bg-gray-300'></div>
                        <div className='w-full h-16 bg-gray-300'></div>
                        <div className='w-full h-16 bg-gray-300'></div>
                    </div>
                ) : (
                    <div className='flex justify-center py-4'>
                        <p className='text-color-60 text-sm'>No crypto payment method!</p>
                    </div>
                )}
    
                <PaymentProcess method={method} setMethod={setMethod} />
            </main>
        )
    }
    

    return (
        <main className='py-7'>
            {Array.isArray(type) && type.length > 0 ? (
                <div className='overflow-x-scroll address'>
                    {type.map((method, index) => {
                        const logo = method.logoUrl;

                        const isLastIndex = index === type.length - 1;
                        return (
                            <div 
                                key={method.$id}
                                className={`min-w-[500px] flex justify-between items-center gap-5 py-2 px-4 bg-gray-50 hover:bg-light-gradient-135deg border-b border-color-10 cursor-pointer ${
                                    index === 0 ? 'rounded-t-md' : ''
                                } ${ isLastIndex ? 'border-none rounded-b-md' : ''}`}
                                onClick={() => setMethod(method)}
                            >
                                <div className='flex items-center gap-2 text-sm text-color-60'>
                                    {/* eslint-disable @next/next/no-img-element */}
                                    <img
                                        src={logo ? logo : '/profile-icon.svg'}
                                        width={30}
                                        height={30}
                                        alt='method logo'
                                        className='rounded-full size-9'
                                    />
                                    {/* eslint-enable @next/next/no-img-element */}
                                    {`${method.type}`}
                                </div>

                                <div>
                                    <p className='text-color-60 font-semibold text-sm mb-2'>Pay ID</p>
                                    <p className='text-color-60 text-sm'>
                                        {`${method.payId}`}
                                    </p>
                                </div>

                                <div>
                                    <p className='text-color-60 font-semibold text-sm mb-2'>Minimum deposit</p>
                                    <p className='text-color-60 text-sm'>
                                        {`${method.minDeposit && formatAmount(method.minDeposit)}`}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : paymentMethodsLoading ? (
                <div className="w-full animate-pulse flex flex-col gap-1">
                    <div className='w-full h-16 bg-gray-300'></div>
                    <div className='w-full h-16 bg-gray-300'></div>
                    <div className='w-full h-16 bg-gray-300'></div>
                </div>
            ) : (
                <div className='flex justify-center py-4'>
                    <p className='text-color-60 text-sm'>No Binance Pay payment method!</p>
                </div>
            )}

            <PaymentProcess method={method} setMethod={setMethod} />
        </main>
    )
}

export default PaymentMethod