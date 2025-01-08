import RatingCard from '@/components/RatingCard'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const About = () => {
    return (
      <main className='flex-1'>
        <div className='w-full h-auto relative'>
            <h1 
                className='text-color-30 text-xl md:text-3xl font-medium absolute pt-[5%] md:pt-[10%] w-full h-full bg-opacity-30 bg-color-60 mx-auto flex justify-center'
            >
                ABOUT US
            </h1>
            
            <Image
                src='/about-header-img.svg'
                width={100}
                height={100}
                alt='contact header image'
                className='w-full h-auto'
            />
        </div>

        <div
          className='bg-dark-gradient-180deg-reverse px-[29px] lg:px-[120px] pb-24 relative flex flex-col justify-between items-center gap-16'
        >
            <div
                className='bg-color-30 w-full md:w-4/5 lg:w-[935px] -mt-[20%] md:-mt-[10%] flex flex-col justify-center gap-4 px-6 md:px-16 pt-8 pb-9 relative'
            >
                <div className='flex flex-col gap-2'>
                    <h3 className='text-color-10 text-base font-medium'>Welcome to Green apuestas - Your Ultimate Correct Score Betting Platform</h3>
                    <p
                        className='text-sm text-color-60'
                    >
                        At Green apuestas, we are passionate about soccer and dedicated to providing our users with the most accurate and reliable correct score predictions. Our platform is designed specifically for soccer enthusiasts who want to take their betting experience to the next level.
                    </p>
                </div>

                <div className='flex flex-col gap-2'>
                    <h3 className='text-color-10 text-base font-medium'>Our mission</h3>
                    <p
                        className='text-sm text-color-60'
                    >
                        Our mission is to provide our users with the most accurate correct score predictions, giving them the edge they need to win big. We achieve this by combining advanced statistical models, machine learning algorithms, and expert analysis from our team of experienced soccer analysts.
                    </p>
                </div>

                <Link href='/about-details' className='absolute bottom-5 right-7 text-xs italic text-color-10 hover:underline'>Read more...</Link>
            </div>

            <div
                className='w-[90%] lg:w-full flex flex-wrap justify-center gap-5'
            >
                <RatingCard />
            </div>
        </div>
      </main>
    )
}

export default About