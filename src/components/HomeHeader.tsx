import React from 'react'
import Image from 'next/image'
import { HeaderImages } from '@/constants';

const HomeHeader = () => {
    return (
        <header className='relative overflow-hidden'>
            {HeaderImages.map(img => {
                return (
                    <Image 
                        key={img.id}
                        src={img.src}
                        width={100}
                        height={100}
                        alt={img.alt}
                        className={`w-full h-auto ${img.id === 1 ? 'image1 image' : img.id === 2 ? 'image2 image' : img.id === 3 ? 'image3 image' : 'invisible'}`}
                    />        
                )
            })}

            {HeaderImages.map(img => {
                return (
                    <div 
                        key={img.id}
                        className={`absolute w-full top-0 bottom-0 bg-color-60 bg-opacity-30 opacity-0 flex flex-col justify-center items-center heroText ${img.id === 1 ? 'image1' : img.id === 2 ? 'image2' : img.id === 3 ? 'image3' : 'invisible'}`}
                    >
                        <div className='w-4/5'>
                            <p
                                className={` text-lg italic font-medium md:text-3xl lg:text-2xl ${img.id === 1 ? 'text-color-60' : 'text-color-10'}`}
                            >{img.titleText}</p>
                            <p 
                                className='text-color-30 text-3xl text-wrap font-medium md:text-6xl lg:text-5xl'
                            >{img.subTitleText}</p>
                        </div>
                    </div>
                )
            })}
        </header>
    )
}

export default HomeHeader