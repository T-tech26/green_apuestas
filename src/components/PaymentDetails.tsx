import { toast } from '@/hooks/use-toast';
import { PaymentMethods } from '@/types/globals';
import React from 'react'
import Image from 'next/image';
import { Button } from './ui/button';


interface MethodProps {
    methodType: PaymentMethods;
    step: number;
    setStep: (newStep: number) => void;
}

const PaymentDetails = ({ methodType, step, setStep }: MethodProps) => {


    const handleNextStep = () => {

        if (step === 1) {
            setStep(step + 1);
        } else {
            setStep(step + 1);
        }
    };


    const handleCopyClick = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
    
            toast({
                description: 'Copied successfully',
            });
        } catch (error) {
            console.error("Failed to copy text:", error);
            toast({
                description: 'Failed to copy text',
            });
        }
    };


    if(methodType.email) {
        return (
            <div className='flex flex-col justify-center gap-5'>
                <div className='flex items-center gap-2 text-sm text-color-60'>
                    {/* eslint-disable @next/next/no-img-element */}
                    <img
                        src={methodType ? methodType.logoUrl : '/profile-icon.svg'}
                        width={30}
                        height={30}
                        alt='method logo'
                        className='rounded-full size-9'
                    />
                    {/* eslint-enable @next/next/no-img-element */}
                    {`${methodType.type}`}
                </div>

                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Platform name</p>
                    <p className='text-sm text-color-60'>{methodType.platformName}</p>
                </div>
    
                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Payment Email/ID</p>
                    <p 
                        className='text-sm text-color-60 flex items-center gap-3'
                        onClick={() => handleCopyClick(methodType.email ? methodType.email : '')}
                    >
                        <Image
                            src='/copy-content-icon.svg'
                            width={15}
                            height={15}
                            alt='menu icons'
                            className='cursor-pointer'
                            onClick={() => handleCopyClick(methodType.email ? methodType.email : '')}
                        />
                        {methodType.email}
                    </p>
                </div>
    
                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Minimum deposit</p>
                    <p className='text-sm text-color-60'>{methodType.minDeposit} USD</p>
                </div>
    
                <Button
                    type='button'
                    className='bg-dark-gradient-135deg'
                    onClick={() => handleNextStep()}
                >
                    Next
                </Button>
            </div>
        )
    }


    if(methodType.bankName) {
        return (
            <div className='flex flex-col justify-center gap-5'>
                <div className='flex items-center gap-2 text-sm text-color-60'>
                    {/* eslint-disable @next/next/no-img-element */}
                    <img
                        src={methodType ? methodType.logoUrl : '/profile-icon.svg'}
                        width={30}
                        height={30}
                        alt='method logo'
                        className='rounded-full size-9'
                    />
                    {/* eslint-enable @next/next/no-img-element */}
                    {`${methodType.type}`}
                </div>

                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Bank name</p>
                    <p className='text-sm text-color-60'>{methodType.bankName}</p>
                </div>

                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Account name</p>
                    <p className='text-sm text-color-60'>{methodType.accountName}</p>
                </div>
    
                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Account number</p>
                    <p 
                        className='text-sm text-color-60 flex items-center gap-3'
                        onClick={() => handleCopyClick(methodType.accountNumber ? methodType.accountNumber : '')}
                    >
                        <Image
                            src='/white-copy-conten-icon.svg'
                            width={20}
                            height={20}
                            alt='menu icons'
                            className='cursor-pointer text-color-30'
                            onClick={() => handleCopyClick(methodType.accountNumber ? methodType.accountNumber : '')}
                        />
                        {methodType.accountNumber}
                    </p>
                </div>

                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Bank currency</p>
                    <p className='text-sm text-color-60'>{methodType.currency}</p>
                </div>

                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Rate</p>
                    <p className='text-sm text-color-60 flex items-center gap-4'>
                        <span>1 USD</span>
                        <Image
                            src='/white-rate-icon.svg'
                            width={15}
                            height={15}
                            alt='rate icon'
                        />
                        {methodType.rate} {methodType.currency}
                    </p>
                </div>
    
                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Minimum deposit</p>
                    <p className='text-sm text-color-60'>{methodType.minDeposit} USD</p>
                </div>
    
                <Button
                    type='button'
                    className='bg-dark-gradient-135deg'
                    onClick={() => handleNextStep()}
                >
                    Next
                </Button>
            </div>
        )
    }


    if(methodType.cryptoName) {
        return (
            <div className='flex flex-col justify-center gap-5'>
                <div className='flex items-center gap-2 text-sm text-color-60'>
                    {/* eslint-disable @next/next/no-img-element */}
                    <img
                        src={methodType ? methodType.logoUrl : '/profile-icon.svg'}
                        width={30}
                        height={30}
                        alt='method logo'
                        className='rounded-full size-9'
                    />
                    {/* eslint-enable @next/next/no-img-element */}
                    {`${methodType.type}`}
                </div>

                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Crypto</p>
                    <p className='text-sm text-color-60'>{methodType.cryptoName}</p>
                </div>

                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Network</p>
                    <p className='text-sm text-color-60'>{methodType.network}</p>
                </div>
    
                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Wallet address</p>
                    <p 
                        className='text-sm text-color-60 flex items-center gap-3'
                        onClick={() => handleCopyClick(methodType.address ? methodType.address : '')}
                    >
                        <Image
                            src='/white-copy-conten-icon.svg'
                            width={20}
                            height={20}
                            alt='menu icons'
                            className='cursor-pointer text-color-30'
                            onClick={() => handleCopyClick(methodType.address ? methodType.address : '')}
                        />
                        {methodType.address}
                    </p>
                </div>
    
                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                    <p className='font-semibold text-base text-color-60'>Minimum deposit</p>
                    <p className='text-sm text-color-60'>{methodType.minDeposit} USD</p>
                </div>
    
                <Button
                    type='button'
                    className='bg-dark-gradient-135deg'
                    onClick={() => handleNextStep()}
                >
                    Next
                </Button>
            </div>
        )
    }


    return (
        <div className='flex flex-col justify-center gap-5'>
            <div className='flex items-center gap-2 text-sm text-color-60'>
                {/* eslint-disable @next/next/no-img-element */}
                <img
                    src={methodType ? methodType.logoUrl : '/profile-icon.svg'}
                    width={30}
                    height={30}
                    alt='method logo'
                    className='rounded-full size-9'
                />
                {/* eslint-enable @next/next/no-img-element */}
                {`${methodType.type}`}
            </div>

            <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                <p className='font-semibold text-base text-color-60'>Pay ID</p>
                <p 
                    className='text-sm text-color-60 flex items-center gap-3'
                    onClick={() => handleCopyClick(methodType.payId ? methodType.payId : '')}
                >
                    <Image
                        src='/copy-content-icon.svg'
                        width={15}
                        height={15}
                        alt='menu icons'
                        className='cursor-pointer'
                        onClick={() => handleCopyClick(methodType.payId ? methodType.payId : '')}
                    />
                    {methodType.payId}
                </p>
            </div>

            <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                <p className='font-semibold text-base text-color-60'>Minimum deposit</p>
                <p className='text-sm text-color-60'>{methodType.minDeposit} USD</p>
            </div>

            <Button
                type='button'
                className='bg-dark-gradient-135deg'
                onClick={() => handleNextStep()}
            >
                Next
            </Button>
        </div>
    )
}

export default PaymentDetails