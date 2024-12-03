import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <main className='flex-1 py-14 overflow-y-scroll'>
        <div className='w-4/5 mx-auto flex flex-col gap-1'>

            <div
                className='bg-white drop-shadow-md px-3 py-2'
            >
                <div className='flex items-center justify-between'>
                    <p className='text-sm text-color-60 font-semibold'>Deposit</p>
                    <p className='text-xs text-gray-400'>09-09-2003</p>
                </div>

                <div className='flex items-center justify-between border-t border-gray-300 py-3'>
                    <div>
                        <p className='text-xs text-gray-400 font-medium'>Method</p>
                        <p className='text-[10px] text-color-60'>USDT deposit</p>
                    </div>

                    <div>
                        <p className='text-xs text-gray-400 font-medium'>Amount</p>
                        <p className='text-[10px] text-color-60'>300 USD</p>
                    </div>

                    <div>
                        <p className='text-xs text-gray-400 font-medium'>Status</p>
                        <p className='text-[10px] text-red-400 flex items-center gap-1 drop-shadow-md bg-red-200 rounded-full px-3'>
                            <Image
                                src='/red-dot-icon.svg'
                                width={10}
                                height={10}
                                alt='pending transaction icon'
                            />
                            Pending
                        </p>
                    </div>
                </div>
            </div>

            <div
                className='bg-white drop-shadow-md px-3 py-2'
            >
                <div className='flex items-center justify-between'>
                    <p className='text-sm text-color-60 font-semibold'>Deposit</p>
                    <p className='text-xs text-gray-400'>09-09-2003</p>
                </div>

                <div className='flex items-center justify-between border-t border-gray-300 py-3'>
                    <div>
                        <p className='text-xs text-gray-400 font-medium'>Method</p>
                        <p className='text-[10px] text-color-60'>USDT deposit</p>
                    </div>

                    <div>
                        <p className='text-xs text-gray-400 font-medium'>Amount</p>
                        <p className='text-[10px] text-color-60'>300 USD</p>
                    </div>

                    <div>
                        <p className='text-xs text-gray-400 font-medium'>Status</p>
                        <p className='text-[10px] text-green-400 flex items-center gap-1 drop-shadow-md bg-green-200 rounded-full px-3'>
                            <Image
                                src='/green-dot-icon.svg'
                                width={10}
                                height={10}
                                alt='approve transaction icon'
                            />
                            Approved
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </main>
  )
}

export default page