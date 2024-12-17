import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Transaction, UserData } from '@/types/globals';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/child_context/userContext';


interface TransactionDetailsProps {
    trans: Transaction | string;
    setShowDetails: (newShowDetails: Transaction | string) => void;
    type: string;
}


const TransactionDetails = ({ trans, setShowDetails, type }: TransactionDetailsProps) => {

    const details = (trans as Transaction);
    const { allUsers } = useUser();

    const [user, setUser] = useState<UserData | string>('');


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if(allUsers.length > 0) {
            const transactionUser = (allUsers as UserData[]).filter(user => user.userId === (trans as Transaction).userId);
            setUser(transactionUser[0]);
        }
    }, [allUsers]);
    /* eslint-enable react-hooks/exhaustive-deps */

    
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

    return (
        <main className='fixed top-0 right-0 left-0 bottom-0 bg-color-60 bg-opacity-30 overflow-y-scroll grid place-items-center py-14'>
            <div 
                className='relative w-[95%] md:w-4/5 md:max-w-[700px] bg-gray-200 rounded-md flex flex-col gap-5 justify-between p-5'
            >
                <Image 
                    src='/close.svg'
                    width={25}
                    height={25}
                    alt='Close icon'
                    className='absolute -top-[30px] -right-[10px] cursor-pointer'
                    onClick={() => setShowDetails('')}
                />

                <div className='flex flex-col gap-2 justify-center items-center bg-color-30 rounded-md py-5'>
                    <h1>LOGO</h1>

                    {type === 'admin' && (
                        <p>{(user as UserData).firstname} {(user as UserData).lastname}</p>
                    )}

                    <p className='text-color-60 text-sm font-semibold'>USD {details.amount}</p>

                    <p 
                        className={`text-[10px] flex items-center gap-1 drop-shadow-md rounded-full pl-2 pr-3 ${
                            details.transaction_status === 'pending' ? 'text-red-400 bg-red-200'
                                    : details.transaction_status === 'rejected' ? 'text-red-400 bg-red-200'
                                        : 'text-green-400 bg-green-200'
                        }`}
                    >
                        <Image
                            src={
                                details.transaction_status === 'pending' ? '/red-dot-icon.svg'
                                    : details.transaction_status === 'rejected' ? '/red-dot-icon.svg'
                                        : '/green-dot-icon.svg'
                            }
                            width={10}
                            height={10}
                            alt='pending transaction icon'
                        />
                        {
                            details.transaction_status === 'pending' ? 'Pending'
                                : details.transaction_status === 'rejected' ? 'Rejected'
                                : 'Approved'
                        }
                    </p>
                </div>

                <div className='bg-color-30 rounded-md p-5 flex flex-col gap-3'>
                    <h1 className='text-color-60 text-sm font-semibold mb-4'>Transaction Details</h1>

                    <div className='flex items-center justify-between'>
                        <p className='text-sm text-gray-400'>Transaction type</p>
                        <p className='text-sm text-color-60'>{details.transaction_type}</p>
                    </div>

                    <div className='flex items-center justify-between'>
                        <p className='text-sm text-gray-400'>Transaction method</p>
                        <p className='text-sm text-color-60'>{
                            details.transaction_details.payId ? 'Binance pay' 
                                : details.transaction_details.cryptoName ? 'Crypto Deposit' 
                                    : details.transaction_method 
                        }</p>
                    </div>

                    {details.transaction_details.payId && (
                        <div className='flex items-center justify-between'>
                            <p className='text-sm text-gray-400'>Binance pay ID</p>
                            <p className='text-sm text-color-60'>{details.transaction_details.payId}</p>
                        </div>
                    )}

                    {details.transaction_details.cryptoName && (
                        <div className='flex items-center justify-between'>
                            <p className='text-sm text-gray-400'>Crypto</p>
                            <p className='text-sm text-color-60'>{details.transaction_details.cryptoName}</p>
                        </div>
                    )}

                    {details.transaction_details.bankName && (
                        <div className='flex items-center justify-between'>
                            <p className='text-sm text-gray-400'>Bank</p>
                            <p className='text-sm text-color-60'>{details.transaction_details.bankName}</p>
                        </div>
                    )}

                    {details.transaction_details.email && (
                        <div className='flex items-center justify-between'>
                            <p className='text-sm text-gray-400'>Platform</p>
                            <p className='text-sm text-color-60'>{details.transaction_details.platformName}</p>
                        </div>
                    )}

                    <div className='flex items-center justify-between'>
                        <p className='text-sm text-gray-400'>Transactions Date</p>
                        <p className='text-sm text-color-60'>{details.transaction_time}</p>
                    </div>

                    <div className='flex items-center justify-between'>
                        <p className='text-sm text-gray-400'>Transactions ticket</p>
                        <p className='text-sm text-color-60 flex items-center gap-2'>
                            {type === 'user' && (<Image
                                src='/copy-content-icon.svg'
                                width={15}
                                height={15}
                                alt='menu icons'
                                className='cursor-pointer'
                                onClick={() => handleCopyClick(details.$id)}
                            />)}
                            {details.$id}
                        </p>
                    </div>
                </div>

                {!details.transaction_details.payId && (
                    <div className='bg-color-30 rounded-md p-5 flex flex-col gap-3'>
                        {details.transaction_details.cryptoName && (
                            <div className='flex items-center justify-between'>
                                <p className='text-sm text-gray-400'>Network</p>
                                <p className='text-sm text-color-60'>{details.transaction_details.network}</p>
                            </div>
                        )}

                        {details.transaction_details.cryptoName && (
                            <div className='flex items-center justify-between'>
                                <p className='text-sm text-gray-400'>Address</p>
                                <p className='text-sm text-color-60 tracking-wide'>{
                                    details.transaction_details.address && details.transaction_details.address.length > 20 ?
                                        details.transaction_details.address.slice(0, 26).padEnd(30, '.')
                                            : details.transaction_details.address
                                }</p>
                            </div>
                        )}

                        {details.transaction_details.bankName && (
                            <div className='flex items-center justify-between'>
                                <p className='text-sm text-gray-400'>Account name</p>
                                <p className='text-sm text-color-60'>{details.transaction_details.accountName}</p>
                            </div>
                        )}

                        {details.transaction_details.bankName && (
                            <div className='flex items-center justify-between'>
                                <p className='text-sm text-gray-400'>Account number</p>
                                <p className='text-sm text-color-60'>{details.transaction_details.accountNumber}</p>
                            </div>
                        )}

                        {details.transaction_details.bankName && (
                            <div className='flex items-center justify-between'>
                                <p className='text-sm text-gray-400'>Bank currency</p>
                                <p className='text-sm text-color-60'>{details.transaction_details.currency}</p>
                            </div>
                        )}


                        {details.transaction_details.bankName && (
                            <div className='flex items-center justify-between'>
                                <p className='text-sm text-gray-400'>Rate</p>
                                <p className='text-sm text-color-60 flex items-center gap-2'>
                                    <span>1 USD</span>

                                    <Image
                                        src='/rate-icon.svg'
                                        width={15}
                                        height={15}
                                        alt='rate icon'
                                    />

                                    {details.transaction_details.rate} {details.transaction_details.currency}
                                </p>
                            </div>
                        )}

                        {details.transaction_details.email && (
                            <div className='flex items-center justify-between'>
                                <p className='text-sm text-gray-400'>Payment Email/ID</p>
                                <p className='text-sm text-color-60'>{details.transaction_details.email}</p>
                            </div>
                        )}
                    </div>
                )}

                {type === 'admin' && (
                    <div className='bg-color-30 rounded-md p-5'>
                        {/* eslint-disable @next/next/no-img-element */}
                        <img 
                            src={(trans as Transaction).recieptUrl ? (trans as Transaction).recieptUrl : '/profile-icon.svg'}
                            width={100}
                            height={100}
                            alt='transaction reciept'
                            className='w-full h-auto'
                        />
                        {/* eslint-enable @next/next/no-img-element */}
                    </div>
                )}
            </div>
        </main>
    )
}

export default TransactionDetails