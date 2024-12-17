import React from 'react'

const page = () => {
    return (
        <main className='flex-1 py-14 overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-4'>
                <h1 className='text-lg text-color-60 font-medium'>Bet History</h1>

                <div 
                    className='bg-color-30 rounded-md'
                >
                    <div className='bg-light-gradient-135deg px-5 py-1 rounded-t-md flex justify-between'>
                        <p className='flex flex-col justify-between text-color-30 text-sm font-medium'>
                            <span>Multiple</span>
                            <span>Ticket ID: 23229384</span>
                        </p>

                        <p className='flex flex-col justify-between text-color-30 text-xs'>
                            <span>won</span>
                            <span>09-09-2022</span>
                        </p>
                    </div>

                    <div className='px-5 py-1 border-b border-gray-300'>
                        <div className='flex items-center justify-evenly py-1 mb-1'>
                            <p className='text-left text-color-60 text-xs w-full'>Muaither SC</p>
                            <span className='text-color-60 text-xs'>vs</span>
                            <p className='text-right text-color-60 text-xs w-full'>AI-Kharitiyath SC</p>
                        </div>

                        <div className='py-1'>
                            <p className='flex items-center justify-between text-gray-400 text-xs'>
                                <span>Market</span> 
                                <span>Correct score</span>
                            </p>
                            <p className='flex items-center justify-between text-color-60 text-xs w-full'>
                                <span className='text-green-400 font-semibold'>won</span> 
                                <span className='text-[10px] text-gray-400'>7.89</span>
                                <span>1 - 0</span>
                            </p>
                        </div>
                    </div>

                    <div className='px-5 py-1 border-b border-gray-300'>
                        <div className='flex items-center justify-evenly py-1 mb-1'>
                            <p className='text-left text-color-60 text-xs w-full'>Muaither SC</p>
                            <span className='text-color-60 text-xs'>vs</span>
                            <p className='text-right text-color-60 text-xs w-full'>AI-Kharitiyath SC</p>
                        </div>

                        <div className='py-1'>
                            <p className='flex items-center justify-between text-gray-400 text-xs'>
                                <span>Market</span> 
                                <span>Correct score</span>
                            </p>
                            <p className='flex items-center justify-between text-color-60 text-xs w-full'>
                                <span className='text-green-400 font-semibold'>won</span> 
                                <span className='text-[10px] text-gray-400'>7.89</span>
                                <span>1 - 0</span>
                            </p>
                        </div>
                    </div>

                    <div className='px-5 py-1 '>
                        <div className='flex items-center justify-evenly py-1 mb-1'>
                            <p className='text-left text-color-60 text-xs w-full'>Muaither SC</p>
                            <span className='text-color-60 text-xs'>vs</span>
                            <p className='text-right text-color-60 text-xs w-full'>AI-Kharitiyath SC</p>
                        </div>

                        <div className='py-1'>
                            <p className='flex items-center justify-between text-gray-400 text-xs'>
                                <span>Market</span> 
                                <span>Correct score</span>
                            </p>
                            <p className='flex items-center justify-between text-color-60 text-xs w-full'>
                                <span className='text-green-400 font-semibold'>won</span> 
                                <span className='text-[10px] text-gray-400'>7.89</span>
                                <span>1 - 0</span>
                            </p>
                        </div>
                    </div>

                    <div className='border-t border-gray-400 px-5 py-3 rounded-b-md'>
                        <p className='flex justify-between text-color-60 text-xs'>
                            <span>Total Odds</span> 
                            <span>23</span>
                        </p>

                        <p className='flex justify-between text-color-60 text-xs'>
                            <span>Stake</span> 
                            <span>$300</span>
                        </p>

                        <p className='flex justify-between text-color-60 text-xs'>
                            <span>Payout:</span> 
                            <span>$7,340</span>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default page