'use client'
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { creditUserBalance, getTransactions, transactionStatus, userNotification } from '@/lib/actions/userActions';
import { formatAmount, generateDateString, transactionsWithImages } from '@/lib/utils';
import { Transaction } from '@/types/globals';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import TransactionDetails from '@/components/TransactionDetails';
import { useTransactionContext } from '@/contexts/child_context/transactionContext';


const WithdrawalRequest = () => {

    const [status, setStatus] = useState('pending');
    const [transactionWithStatus, setTransactionWithStatus] = useState<Transaction[]>([]);
    const [transactionLoading, setTransactionLoading] = useState(true);
    const [showDetails, setShowDetails] = useState<Transaction | string>('');

    const { transactions, setTransactions } = useTransactionContext();


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if(transactions.length > 0) {
            const transStatus = transactions.filter(trans => trans.transaction_status === status && trans.transaction_type === 'Withdrawal');
            setTransactionWithStatus(transStatus.reverse());
            if(transactionLoading) setTransactionLoading(!transactionLoading);
        }
    }, [status, transactions]);
    /* eslint-enable react-hooks/exhaustive-deps */



    const handleStatus = async (id: string, status: string, userId?: string, amount?: string) => {

        const date = generateDateString();

        try {
            // update the transaction status
            const updated = await transactionStatus(id, status);

            // if transaction status is approved then deduct from balance if withdrawal or add amount to balance if deposit
            if(userId && amount) { 
                await creditUserBalance(userId, amount, 'deduct');
            }   
            
            if(updated !== 'success') return;

            // when transaction status is updated notify user, if approved or rejected
            await userNotification(userId!, `withdrawal ${status}`, date, '');

            toast({
                description: `Successfully ${status} user withdrawal`
            });

            // get the transactions when all conditions are successfull
            const updatedTrans = await getTransactions();
            if(typeof updatedTrans === 'string') return;
            const modifyTransactions = transactionsWithImages(updatedTrans);
            setTransactions(modifyTransactions);
        } catch (error) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            toast({
                description: `${status}ing, try again`
            });
            /* eslint-enable @typescript-eslint/no-explicit-any */
            console.error(`Error ${status} `, error);
        }
    }



    return (
        <main className='flex-1 py-14 overflow-x-hidden overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-10'>
                <h1 className='text-lg text-color-60 font-medium'>WITHDRAWAL REQUEST</h1>

                <div
                    className='flex items-center flex-wrap py-3'
                >
                    <Button 
                        type='button'
                        className={`rounded-none bg-dark-gradient-135deg hover:bg-light-gradient-135deg focus:outline-none outline-none focus:border-none
                            ${
                                status === 'pending' ? 'bg-light-gradient-135deg' : ''
                            }`}
                        onClick={() => setStatus('pending')}
                    >
                        Pending
                    </Button>

                    <Button 
                        type='button'
                        className={`rounded-none bg-dark-gradient-135deg hover:bg-light-gradient-135deg focus:outline-none outline-none focus:border-none
                            ${
                                status === 'rejected' ? 'bg-light-gradient-135deg' : ''
                            }`}
                        onClick={() => setStatus('rejected')}
                    >
                        Rejected
                    </Button>

                    <Button 
                        type='button'
                        className={`rounded-none bg-dark-gradient-135deg hover:bg-light-gradient-135deg focus:outline-none outline-none focus:border-none
                            ${
                                status === 'approved' ? 'bg-light-gradient-135deg' : ''
                            }`}
                        onClick={() => setStatus('approved')}
                    >
                        Approved
                    </Button>
                </div>

                <div className='w-full mx-auto flex flex-col gap-1'>
                    {transactionWithStatus.length > 0 ? (
                        <>
                            {transactionWithStatus.map(trans => {
                                return (
                                    <div
                                        key={trans.$id}
                                        className='bg-white drop-shadow-md rounded-md px-3 py-2 border border-gray-200 hover:bg-gray-50 hover:border-color-10 hover:border'
                                    >
                                        <div className='flex items-center justify-between'>
                                            <p className='text-sm text-color-60 font-semibold'>{trans.transaction_type}</p>

                                            <p 
                                                className='text-xs text-gray-400 hover:text-color-10 hover:underline cursor-pointer'
                                                onClick={() => setShowDetails(trans)}
                                            >Show details</p>

                                            <p className='text-xs text-gray-400'>{trans.transaction_time}</p>
                                        </div>

                                        <div className='flex items-center justify-between border-t border-gray-300 py-3'>
                                            <div>
                                                <p className='text-xs text-gray-400 font-medium mb-1'>{
                                                    trans.transaction_details.payId ? 'Binance pay' : trans.transaction_method
                                                }</p>

                                                {trans.transaction_type === 'Withdrawal' ? (
                                                    <p className='text-[10px] text-color-60'>Bank withdrawal</p>
                                                )  : (
                                                    <p className='text-[10px] text-color-60'>{
                                                        trans.transaction_details.payId ? 'USDT'
                                                            : trans.transaction_details.cryptoName ? trans.transaction_details.cryptoName
                                                                : trans.transaction_details.bankName ? 'Bank'
                                                                    : trans.transaction_details.platformName
                                                        } deposit
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400 font-medium mb-1'>Amount</p>
                                                <p className='text-[10px] text-color-60'>{formatAmount(trans.amount)} USD</p>
                                            </div>

                                            <div className='flex flex-col gap-1 items-center'>
                                                <p className='text-xs text-gray-400 font-medium'>Status</p>
                                                <p 
                                                    className={`text-[10px] flex items-center gap-1 drop-shadow-md rounded-full pl-2 pr-3 ${
                                                        trans.transaction_status === 'pending' ? 'text-red-400 bg-red-200'
                                                                : trans.transaction_status === 'rejected' ? 'text-red-400 bg-red-200'
                                                                    : 'text-green-400 bg-green-200'
                                                    }`}
                                                >
                                                    <Image
                                                        src={
                                                            trans.transaction_status === 'pending' ? '/red-dot-icon.svg'
                                                                : trans.transaction_status === 'rejected' ? '/red-dot-icon.svg'
                                                                    : '/green-dot-icon.svg'
                                                        }
                                                        width={10}
                                                        height={10}
                                                        alt='pending transaction icon'
                                                    />
                                                    {
                                                        trans.transaction_status === 'pending' ? 'Pending'
                                                            : trans.transaction_status === 'rejected' ? 'Rejected'
                                                            : 'Approved'
                                                    }
                                                </p>
                                            </div>

                                            {trans.transaction_status === 'pending' && (
                                                <div className='flex flex-col md:flex-row items-center gap-2'>
                                                    <Button 
                                                        type='button'
                                                        className='w-20 h-6 text-xs text-color-30 bg-light-gradient-135deg px-0 py-0 rounded-full focus:outline-none'
                                                        onClick={() => handleStatus(trans.$id, 'approved', trans.userId, trans.amount)}
                                                    >
                                                        Approve
                                                    </Button>

                                                    <Button 
                                                        type='button'
                                                        className='w-20 h-6 text-xs text-color-30 bg-light-gradient-135deg px-0 py-0 rounded-full focus:outline-none'
                                                        onClick={() => handleStatus(trans.$id, 'rejected', trans.userId)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}                                                            
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                    ) : !transactionLoading ? (
                        <div className='w-full py-4 flex flex-col items-center justify-center gap-2'>
                            <p className='text-color-60 text-sm font-semibold'>No user deposits yet!</p>
                        </div>
                    ) : (
                        <div className="w-full animate-pulse flex flex-col gap-1">
                            <div className='w-full h-16 bg-gray-300'></div>
                            <div className='w-full h-16 bg-gray-300'></div>
                            <div className='w-full h-16 bg-gray-300'></div>
                        </div>
                    )}
                </div>
            </div>

            {typeof showDetails === 'object' && (
                <TransactionDetails trans={showDetails} setShowDetails={setShowDetails} type='admin' />
            )}
        </main>
    )
}

export default WithdrawalRequest