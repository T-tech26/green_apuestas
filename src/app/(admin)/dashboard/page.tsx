'use client'
import { useUser } from '@/contexts/child_context/userContext'
import { UserData } from '@/types/globals';
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import User from '@/components/User';
import { formatAmount } from '@/lib/utils';
import { useTransactionContext } from '@/contexts/child_context/transactionContext';

const Dashboard = () => {

    const { allUsers, getUsers, allUsersLoading, setAllUsersLoading } = useUser();
    const { transactions, getAllTransactions, setTransactionsLoading, transactionsLoading } = useTransactionContext()
    const [selectedUser, setSelectedUser] = useState<UserData | string>('');

    let balance = 0;
    let totalDeposit = 0;
    let numberOfDeposit = 0;
    let numberOfWidthdrawals = 0;
    let pending = 0;


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if(!allUsers.length) {
            getUsers();
        } 

        if(!transactions.length) {
            getAllTransactions();
        } 
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */


    if(allUsers.length > 0 && transactions.length > 0) {

        balance = allUsers.reduce((total, user) => {
            return total = total + Number(user.balance);
        }, 0);

        // Filter transactions
        const depositTransactions = transactions.filter(trans => trans.transaction_type === 'Deposit' && trans.transaction_status === 'approved');

        const widthdrawTransactions = transactions.filter(trans => trans.transaction_type === 'Widthdrawal' && trans.transaction_status === 'approved');

        const pendingTransactions = transactions.filter(trans => trans.transaction_status === 'pending');

        numberOfDeposit = depositTransactions.length;
        numberOfWidthdrawals = widthdrawTransactions.length;
        pending = pendingTransactions.length;

        totalDeposit = depositTransactions.reduce((total, trans) => {
            return total = total + Number(trans.amount);
        }, 0);

        setAllUsersLoading(false);
        setTransactionsLoading(false);
    }



    return (
        <>
            <main className='flex-1 py-14 overflow-x-hidden overflow-y-scroll'>
                <div className='w-4/5 mx-auto flex flex-col gap-10'>
                    <h1 className='text-lg text-color-60 font-medium'>Dashboard</h1>

                    {!allUsersLoading && !transactionsLoading ? (
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                            <div className='bg-color-30 rounded-md drop-shadow-md px-4 py-7'>
                                <p className='text-color-60 text-2xl font-semibold'>{allUsers.length < 10 ? `0${allUsers.length}` : allUsers.length}</p>
                                <p className='text-color-60 text-sm'>Total Users</p>
                            </div>

                            <div className='bg-color-30 rounded-md drop-shadow-md px-4 py-7'>
                                <p className='text-color-60 text-2xl font-semibold'><span className='text-sm'>$</span>
                                    {formatAmount(balance.toString())}</p>
                                <p className='text-color-60 text-sm'>Total User Funds</p>
                            </div>

                            <div className='bg-color-30 rounded-md drop-shadow-md px-4 py-7'>
                                <p className='text-color-60 text-2xl font-semibold'><span className='text-sm'>$</span>
                                    {formatAmount(totalDeposit.toString())}</p>
                                <p className='text-color-60 text-sm'>Total Deposit</p>
                            </div>

                            <div className='bg-color-30 rounded-md drop-shadow-md px-4 py-7'>
                                <p className='text-color-60 text-2xl font-semibold'>
                                    {numberOfDeposit < 10 ? `0${formatAmount(numberOfDeposit.toString())}` : numberOfDeposit}
                                </p>
                                <p className='text-color-60 text-sm'>Number of Deposits</p>
                            </div>

                            <div className='bg-color-30 rounded-md drop-shadow-md px-4 py-7'>
                                <p className='text-color-60 text-2xl font-semibold'>
                                    {numberOfWidthdrawals < 10 ? `0${formatAmount(numberOfWidthdrawals.toString())}` : numberOfWidthdrawals}
                                </p>
                                <p className='text-color-60 text-sm'>Number of Withdrawals</p>
                            </div>

                            <div className='bg-color-30 rounded-md drop-shadow-md px-4 py-7'>
                                <p className='text-color-60 text-2xl font-semibold'>
                                    {pending < 10 ? `0${formatAmount(pending.toString())}` : pending}
                                </p>
                                <p className='text-color-60 text-sm'>Pending Transactions</p>
                            </div>
                        </div>
                    ) : (
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 animate-pulse'>
                            <div className='w-full h-28 bg-gray-300 rounded-md'></div>
                            <div className='w-full h-28 bg-gray-300 rounded-md'></div>
                            <div className='w-full h-28 bg-gray-300 rounded-md'></div>
                            <div className='w-full h-28 bg-gray-300 rounded-md'></div>
                            <div className='w-full h-28 bg-gray-300 rounded-md'></div>
                            <div className='w-full h-28 bg-gray-300 rounded-md'></div>
                        </div>
                    )}

                    <div className='border border-gray-300 min-w-[200px] rounded-md overflow-x-scroll'>
                        <h1 className='p-4 text-lg text-color-60 font-medium w-full'>All users.</h1>
                        <Table>
                            <TableHeader className='bg-dark-gradient-135deg'>
                                <TableRow>
                                    <TableHead className="text-color-30">Name</TableHead>
                                    <TableHead className="text-color-30">Email Address</TableHead>
                                    <TableHead className="text-color-30">Balance</TableHead>
                                    <TableHead className="text-right text-color-30">Subscription</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allUsers.length ? (
                                    <>
                                        {allUsers.map((user, index) => (
                                            <TableRow 
                                                key={user.userId} 
                                                className={`hover:bg-light-gradient-135deg cursor-pointer ${index % 2 === 1 ? 'bg-gray-50' : ''}`}
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <TableCell className="font-medium flex gap-1 items-center min-w-48">
                                                    {/* eslint-disable @next/next/no-img-element */}
                                                    <img
                                                        src={user.profileImg ? user.profileImgUrl : '/profile-icon.svg'}
                                                        width={50}
                                                        height={50}
                                                        alt='menu icons'
                                                        className='cursor-pointer'
                                                    />
                                                    {/* eslint-enable @next/next/no-img-element */}
                                                    {`${user.lastname} ${user.firstname}`}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{formatAmount(user.balance)}</TableCell>
                                                <TableCell className="text-right">{user.subscription === true ? 'User subscribed' : 'User Unsubscribed'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : allUsersLoading ? (
                                    <>
                                        <TableRow className='w-full animate-pulse'>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                        </TableRow>
                                        <TableRow className='w-full animate-pulse'>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                        </TableRow>
                                        <TableRow className='w-full animate-pulse'>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                        </TableRow>
                                        <TableRow className='w-full animate-pulse'>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                            <TableCell className="min-w-48 h-16 bg-gray-300"></TableCell>
                                        </TableRow>
                                    </>
                                ) : (
                                    <div className='w-full py-4 flex flex-col items-center justify-center gap-2'>
                                        <p className='text-color-60 text-sm font-semibold'>No registered users</p>
                                    </div>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {typeof selectedUser === 'object' && (<User user={selectedUser} setUser={setSelectedUser} />)}
            </main>
        </>
    )
}

export default Dashboard