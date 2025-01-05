'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { RateDetails } from '@/constants'


interface RateDetailsType {
    profile: string,
    name: string,
    message: string,
    rates: number
}


const RatingCard = () => {

    const totalStars = 5;

    const [selectedDetails, setSelectedDetails] = useState<RateDetailsType[]>([]);


    useEffect(() => {
        // Generate three random numbers
        const randomNumber: number[] = [];

        while(randomNumber.length < 3) {
            const number = Math.floor(Math.random() * RateDetails.length);

            if(!randomNumber.includes(number)) {
                randomNumber.push(number);
            }
        }

        const filteredDetails = RateDetails.filter((_,index) => randomNumber.includes(index));
        setSelectedDetails(filteredDetails);
    }, [RateDetails]);



    return (
        <>
            {selectedDetails.length > 0 && selectedDetails.map((items, index) => {
                return (
                    <article 
                        key={index}
                        className='bg-color-30 p-7 rounded-3xl border-2 border-color-10 w-[300px] flex flex-col'
                    >
                        <div
                            className='flex gap-4 items-center w-full mb-3'
                        >
                            <Image
                                src={items.profile}
                                width={60}
                                height={60}
                                alt={items.name}
                                className='border-2 border-color-10 rounded-full size-[50px]'
                            />
                            
                            <p className='text-color-10 text-base font-medium'>{items.name}</p>
                        </div>

                        <div
                            className='flex flex-col gap-5 flex-1'
                        >
                            <p className='text-color-60 text-sm flex-1'>{items.message}</p>
                            
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