import { UserData } from '@/types/globals'
import React from 'react'
import Image from 'next/image'

interface User {
    user: UserData | string
    setUser: (user: UserData | string) => void
}

const User = ({ user, setUser }: User) => {
    return (
        <section
            className='fixed w-full h-screen top-0 right-0 bg-color-60 bg-opacity-30 flex justify-center items-center'
        >
            <div className='relative flex flex-col gap-10 w-4/5 h-4/5 overflow-y-scroll bg-dark-gradient-135deg p-5 md:p-10 rounded-lg'>
                
                <Image
                    src='/close.svg'
                    width={20}
                    height={20}
                    alt='close icon'
                    className='absolute right-5 top-5 cursor-pointer'
                    onClick={() => setUser('')}
                />

                <div className='flex flex-col justify-between md:flex-row gap-5'>
                    <div className='w-full'>
                        <h3 className='text-color-30 text-base mb-2'>First name</h3>
                        <p className='text-color-30 text-sm px-3 py-2 border border-color-10 rounded-md'>
                            {(user as UserData).firstname}
                        </p>
                    </div>

                    <div className='w-full'>
                        <h3 className='text-color-30 text-base mb-2'>Last name</h3>
                        <p className='text-color-30 text-sm px-3 py-2 border border-color-10 rounded-md'>
                            {(user as UserData).lastname}
                        </p>
                    </div>
                </div>

                <div className='flex flex-col justify-between md:flex-row gap-5'>
                    <div className='w-full'>
                        <h3 className='text-color-30 text-base mb-2'>Email Address</h3>
                        <p className='text-color-30 text-sm px-3 py-2 border border-color-10 rounded-md flex flex-col lg:flex-row gap-2 justify-between items-center'>
                            <span>{(user as UserData).email}</span> 

                            <span 
                                className={`flex items-center justify-between text-xs text-red-300 rounded-full pl-2 pr-5 py-[2px] bg-red-50 ${
                                    (user as UserData)?.email_verified ? 'bg-green-300 text-green-300' : ''
                                }`}
                            >
                                        <Image
                                            src={`${(user as UserData)?.email_verified ? '/green-dot-icon.svg' : '/red-dot-icon.svg'}`}
                                            width={10}
                                            height={10}
                                            alt='dot icon'
                                        />

                                        {(user as UserData)?.email_verified ? 'Verified' : 'Unverified'}
                            </span>
                        </p>
                    </div>

                    <div className='w-full'>
                        <h3 className='text-color-30 text-base mb-2'>Phone number</h3>
                        <p className='text-color-30 text-sm px-3 py-2 border border-color-10 rounded-md'>
                            {(user as UserData).phone}
                        </p>
                    </div>
                </div>
                
                <div className='flex flex-col justify-between md:flex-row gap-5'>
                    <div className='w-full'>
                        <h3 className='text-color-30 text-base mb-2'>Date of Birth</h3>
                        <p className='text-color-30 text-sm px-3 py-2 border border-color-10 rounded-md'>
                            {(user as UserData).dateOfBirth}
                        </p>
                    </div>

                    <div className='w-full'>
                        <h3 className='text-color-30 text-base mb-2'>Country</h3>
                        <p className='text-color-30 text-sm px-3 py-2 border border-color-10 rounded-md'>
                            {(user as UserData).country}
                        </p>
                    </div>

                    <div className='w-full'>
                        <h3 className='text-color-30 text-base mb-2'>State</h3>
                        <p className='text-color-30 text-sm px-3 py-2 border border-color-10 rounded-md'>
                            {(user as UserData).state}
                        </p>
                    </div>
                </div>

                <div className='flex flex-col justify-between md:flex-row gap-5'>
                    <div className='w-full'>
                        <h3 className='text-color-30 text-base mb-2'>City</h3>
                        <p className='text-color-30 text-sm px-3 py-2 border border-color-10 rounded-md'>
                            {(user as UserData).city}
                        </p>
                    </div>

                    <div className='w-full'>
                        <h3 className='text-color-30 text-base mb-2'>KYC Verification</h3>
                        <p className='text-color-30 text-sm px-3 py-2 border border-color-10 rounded-md'>
                            {(user as UserData).identity_verified === true ? 'Verified' : 'Unverified'}
                        </p>
                    </div>

                    <div className='w-full'>
                        <h3 className='text-color-30 text-base mb-2'>Subscription</h3>
                        <p className='text-color-30 text-sm px-3 py-2 border border-color-10 rounded-md'>
                            {(user as UserData).subscription === true ? 'User subscribed' : 'User not subscribed'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default User