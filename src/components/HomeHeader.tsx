import React from 'react'
import Image from 'next/image'

const HomeHeader = () => {
    return (
        <header className='relative'>
            <Image 
                src='/home-header-img.svg'
                width={100}
                height={100}
                alt='home header'
                className='w-full h-auto'
            />

            <div 
                className='absolute w-full top-0 bottom-0 bg-color-60 bg-opacity-30 flex flex-col justify-center items-center'
            >
                <div>
                    <p
                        className='text-color-10 text-lg italic font-medium md:text-3xl lg:text-2xl'
                    >100% Accurate</p>
                    <p 
                        className='text-color-30 text-3xl font-medium md:text-6xl lg:text-5xl'
                    >Correct Score Bets</p>
                </div>
            </div>
        </header>
    )
}

export default HomeHeader