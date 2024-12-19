'use client'
import { useUser } from '@/contexts/child_context/userContext'
import { UserData } from '@/types/globals';
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from 'next/image';
import User from '@/components/User';

const Dashboard = () => {

    const { allUsers } = useUser();
    const [selectedUser, setSelectedUser] = useState<UserData | string>('');

    let balance;
    

    if(allUsers.length > 0) {
        balance = (allUsers as UserData[]).reduce((total, user) => {
            return total = Number(user.balance);
        }, 0);
    }


    return (
        <>
            {Array.isArray(allUsers) && (
                <main className='flex-1 py-14 overflow-x-hidden overflow-y-scroll'>
                    <div className='w-4/5 mx-auto flex flex-col gap-10'>
                        <h1 className='text-lg text-color-60 font-medium'>Dashboard</h1>
        
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                            <div className='bg-color-30 rounded-md drop-shadow-md px-4 py-7'>
                                <p className='text-color-60 text-2xl font-semibold'>{allUsers.length}</p>
                                <p className='text-color-60 text-sm'>Total Users</p>
                            </div>
        
                            <div className='bg-color-30 rounded-md drop-shadow-md px-4 py-7'>
                                <p className='text-color-60 text-2xl font-semibold'><span className='text-sm'>$</span>{balance}</p>
                                <p className='text-color-60 text-sm'>Total User Funds</p>
                            </div>
        
                            <div className='bg-color-30 rounded-md drop-shadow-md px-4 py-7'>
                                <p className='text-color-60 text-2xl font-semibold'><span className='text-sm'>$</span>{balance}</p>
                                <p className='text-color-60 text-sm'>Total Deposit</p>
                            </div>
        
                            <div className='bg-color-30 rounded-md drop-shadow-md px-4 py-7'>
                                <p className='text-color-60 text-2xl font-semibold'>{allUsers.length}</p>
                                <p className='text-color-60 text-sm'>Number of Deposits</p>
                            </div>
        
                            <div className='bg-color-30 rounded-md drop-shadow-md px-4 py-7'>
                                <p className='text-color-60 text-2xl font-semibold'>{balance}</p>
                                <p className='text-color-60 text-sm'>Number of Withdrawals</p>
                            </div>
        
                            <div className='bg-color-30 rounded-md drop-shadow-md px-4 py-7'>
                                <p className='text-color-60 text-2xl font-semibold'>{balance}</p>
                                <p className='text-color-60 text-sm'>Pending Transactions</p>
                            </div>
                        </div>
        
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
                                    {allUsers.length && (allUsers as UserData[]).map((user, index) => (
                                        <TableRow 
                                            key={user.userId} 
                                            className={`hover:bg-light-gradient-135deg cursor-pointer ${index % 2 === 1 ? 'bg-gray-50' : ''}`}
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <TableCell className="font-medium flex gap-1 items-center">
                                                <Image
                                                    src='/profile-icon.svg'
                                                    width={30}
                                                    height={30}
                                                    alt='menu icons'
                                                    className='cursor-pointer'
                                                />
                                                {`${user.lastname} ${user.firstname}`}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.balance}</TableCell>
                                            <TableCell className="text-right">{user.subscription === true ? 'User subscribed' : 'User Unsubscribed'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
        
                    {typeof selectedUser === 'object' && (<User user={selectedUser} setUser={setSelectedUser} />)}
                </main>
            )}
        </>
    )
}

export default Dashboard