import React from 'react'
import { LanguageSwitcher } from './LanguageSwitcher';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logOut } from '@/lib/actions/userActions';
import { redirect } from 'next/navigation';
  

interface ProfileProps {
    name: string,
    balance: string
}

const LoggedInHeader = ({ name, balance }: ProfileProps) => {

    const handleLogOut = async () => {
        const response = await logOut();

        if(response === 'success') return redirect('/signin');
    }

    return (
        <div className="header">
            <div className="md:hidden flex items-center justify-between">
                <div className="flex items-center">
                    <h3 className="font-medium text-sm text-color-30 tracking-wide pr-2 italic">
                    Top winners
                    </h3>
                    <p className="font-light text-xs text-color-30 tracking-wide border-l pl-2 italic">
                    ArthurMic won $700,000
                    </p>
                </div>

                <LanguageSwitcher />
            </div>

            <div className="flex justify-between items-center gap-5">
                <h1 className="text-2xl text-color-30 font">Logo</h1>

                <div className="md:flex flex-1 items-center hidden">
                    <h3 className="font-medium text-sm text-color-30 tracking-wide pr-2 italic">
                    Top winners
                    </h3>
                    <p className="font-light text-xs text-color-30 tracking-wide border-l pl-2 italic">
                    ArthurMic won $700,000
                    </p>
                </div>
            
                <div className="flex justify-between items-center gap-3">
                    <div className="md:flex justify-between gap-1 items-center hidden">
                        <LanguageSwitcher />
                    </div>

                    <div
                        className='flex gap-3 justify-between items-center max:w-52'
                    >
                        <Image
                            src='/profile-icon.svg'
                            width={40}
                            height={40}
                            alt='profile icon'
                        />

                        <div>
                            <p className='text-color-30 text-sm'>{name}</p>
                            <p className='text-color-30 text-xs'>{balance} USD</p>
                        </div>

                        <div
                            className='relative flex justify-center items-center bg-light-gradient-135deg border-[1px] border-color-30 rounded-md cursor-pointer'
                        >
                            <DropdownMenu>
                                <DropdownMenuTrigger 
                                    className='outline-none border-none focus:outline-none focus:border-none'
                                >
                                    <Image
                                        src='/arrow_drop_down.svg'
                                        width={30}
                                        height={30}
                                        alt='profile menu'
                                        className='cursor-pointer'
                                    />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent  className='bg-dark-gradient-135deg h-auto flex flex-col justify-center text-color-30 absolute right-0 top-5 w-52'>

                                    <div
                                        className='flex items-center pl-4 gap-2 py-3 w-full bg-light-gradient-135deg'
                                    >
                                        <Image
                                            src='/profile-icon.svg'
                                            width={40}
                                            height={40}
                                            alt='profile icon'
                                        />

                                        <div>
                                            <p className='text-color-30 text-sm'>{name}</p>
                                        </div>
                                    </div>

                                    <DropdownMenuItem 
                                        className='px-5 py-3 border-b-2 border-color-10 hover:bg-light-gradient-135deg cursor-pointer flex gap-2 items-center'
                                    >
                                        <Image
                                            src='/personal-profile-icon.svg'
                                            width={20}
                                            height={20}
                                            alt='personal profile icon'
                                            className='cursor-pointer'
                                        />
                                        Personal Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        className='px-5 py-3 border-b-2 border-color-10 hover:bg-light-gradient-135deg cursor-pointer flex gap-2 items-center'
                                    >
                                        <Image
                                            src='/deposit-icon.svg'
                                            width={20}
                                            height={20}
                                            alt='deposit icon'
                                            className='cursor-pointer'
                                        />
                                        Make a deposit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        className='px-5 py-3 border-b-2 border-color-10 hover:bg-light-gradient-135deg cursor-pointer flex gap-2 items-center'
                                    >   
                                        <Image
                                            src='/withdraw-icon.svg'
                                            width={20}
                                            height={20}
                                            alt='withdrawal icon'
                                            className='cursor-pointer'
                                        />
                                        Withdraw funds
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        className='px-5 py-3 border-b-2 border-color-10 hover:bg-light-gradient-135deg cursor-pointer flex gap-2 items-center'
                                    >
                                        <Image
                                            src='/transaction-icon.svg'
                                            width={20}
                                            height={20}
                                            alt='transaction icon'
                                            className='cursor-pointer'
                                        />
                                        Transaction history
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        className='px-5 py-3 border-b-2 border-color-10 hover:bg-light-gradient-135deg cursor-pointer flex gap-2 items-center'
                                    >
                                        <Image
                                            src='/betslip-icon.svg'
                                            width={20}
                                            height={20}
                                            alt='bet history icon'
                                            className='cursor-pointer'
                                        />
                                        Bet history
                                    </DropdownMenuItem>

                                    <div className='h-20'></div>

                                    <DropdownMenuItem 
                                        className='px-5 py-3 border-t-2 border-color-10 hover:bg-light-gradient-135deg cursor-pointer flex gap-2 items-center'
                                        onClick={() => handleLogOut()}
                                    >
                                        <Image
                                            src='/logout.svg'
                                            width={20}
                                            height={20}
                                            alt='logout icon'
                                            className='cursor-pointer'
                                        />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoggedInHeader