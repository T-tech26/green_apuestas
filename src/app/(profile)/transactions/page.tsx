'use client'
import LiveChat from '@/components/LiveChat'
import TransactionDetails from '@/components/TransactionDetails'
import { useTransactionContext } from '@/contexts/child_context/transactionContext'
import { useUser } from '@/contexts/child_context/userContext'
import { formatAmount } from '@/lib/utils'
import { Transaction, UserData } from '@/types/globals'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const TransactionHistory = () => {
    
    const { transactions, getAllTransactions, transactionsLoading, setTransactionsLoading } = useTransactionContext();
    const { user } = useUser();

    const [showDetails, setShowDetails] = useState<Transaction | string>('');
    const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
    
    
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if(transactions.length > 0) {
            const userTransaction = transactions.filter(userTrans => userTrans.userId === (user as UserData).userId);
            setUserTransactions(userTransaction.reverse());
            setTransactionsLoading(false);
        }
    }, [transactions]);


    useEffect(() => {
        if(!transactions.length) {
            getAllTransactions();
        }
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */


    return (
        <main className='flex-1 pt-14 md:py-14 overflow-x-hidden overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-5 overflow-x-scroll md:overflow-x-hidden address pb-14 md:pb-0'>
                <h1 className='text-lg text-color-60 font-medium'>TRANSACTION HISTORY</h1>

                {userTransactions.length > 0 ? (
                    <div className='w-full min-w-[400px] mx-auto'>
                        {userTransactions.map(trans => {
                            return (
                                <div
                                    key={trans.$id}
                                    className='bg-white drop-shadow-md cursor-pointer mb-1 rounded-md px-3 py-2 border border-gray-200 hover:bg-gray-50 hover:border-color-10 hover:border'
                                    onClick={() => setShowDetails(trans)}
                                >
                                    <div className='flex items-center justify-between'>
                                        <p className='text-sm text-color-60 font-semibold'>{trans.transaction_type}</p>
                                        <p className='text-xs text-gray-400' translate='no'>{trans.transaction_time}</p>
                                    </div>

                                    <div className='flex items-center justify-between border-t border-gray-300 py-3'>
                                        <div>
                                            <p className='text-xs text-gray-400 font-medium mb-1'>{
                                                trans.transaction_details.payId ? 'Binance pay' : trans.transaction_method
                                            }</p>

                                            {trans.transaction_type === 'Withdrawal' ? (
                                                <p className='text-[10px] text-color-60'>Bank withdrawal</p>
                                            ): (
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
                                            <p className='text-[10px] text-color-60' translate='no'>{formatAmount(trans.amount)} USD</p>
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
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : transactionsLoading ? (
                    <div className="w-full animate-pulse flex flex-col gap-1">
                        <div className='w-full h-16 bg-gray-300'></div>
                        <div className='w-full h-16 bg-gray-300'></div>
                        <div className='w-full h-16 bg-gray-300'></div>
                    </div>
                ) : (
                    <div className='w-full py-4 flex flex-col items-center justify-center gap-2'>
                        <p className='text-color-60 text-sm font-semibold'>You have no transactions yet</p>
                        <Link href='/deposit' className='text-color-30 text-xs bg-light-gradient-135deg py-2 px-5 rounded-full'>Make a Deposit</Link>
                    </div>
                )}
            </div>

            {typeof showDetails === 'object' && (
                <TransactionDetails trans={showDetails} setShowDetails={setShowDetails} type='user' />
            )}

            <LiveChat />
        </main>
    )
}

export default TransactionHistory