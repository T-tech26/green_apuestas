import React from 'react'
import Image from 'next/image'
import { RateDetails } from '@/constants'

const RatingCard = () => {

    const totalStars = 5;

  return (
    <>
        {RateDetails.map((items) => {
            return (
                <article 
                    key={items.name}
                    className='bg-color-30 p-7 rounded-tr-[20%] rounded-bl-[20%] border-4 border-color-10 w-[300px]'
                >
                    <div
                        className='flex gap-4 items-center w-full mb-3'
                    >
                        <Image
                            src={items.profile}
                            width={60}
                            height={60}
                            alt={items.name}
                            className='border-2 border-color-10 rounded-full'
                        />
                        
                        <p className='text-color-10 text-base font-medium'>{items.name}</p>
                    </div>

                    <div
                        className='flex flex-col gap-5'
                    >
                        <p className='text-color-60 text-sm'>{items.message}</p>
                        
                        <div
                            className='flex justify-between'
                        >
                            {Array.from({ length: totalStars }).map((_, index) => {

                                const starSrc = index < items.rates ? '/fill-star.svg' : '/no-fill-star.svg';
            
                                return (
                                    <Image
                                        key={index}
                                        src={starSrc}
                                        width={30}
                                        height={30}
                                        alt='star'
                                    />
                                );
                            })}
                        </div>
                    </div>
                </article>
            )
        })}
    </>
  )
}

export default RatingCard