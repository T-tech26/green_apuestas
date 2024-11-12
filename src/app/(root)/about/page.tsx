import RatingCard from '@/components/RatingCard'
import Image from 'next/image'
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
          className='bg-color-30 w-[90%] md:w-4/5 lg:w-[935px] -mt-[20%] md:-mt-[10%] flex flex-col justify-center px-8 md:px-16 pt-8 pb-9'
        >
          <h3 className='text-color-10 text-lg md:text-xl font-medium mb-2'>Know more about us</h3>
          <p
            className='text-sm md:text-base text-color-60'
          >
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, culpa ullam, voluptatem odit, sunt veritatis facere accusamus maiores odio assumenda sequi est vero amet impedit hic! Sapiente veritatis totam at?
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, culpa ullam, voluptatem odit, sunt veritatis facere accusamus maiores odio assumenda sequi est vero amet impedit hic! Sapiente veritatis totam at? 
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, culpa ullam, voluptatem odit, sunt veritatis facere accusamus maiores odio assumenda sequi est vero amet impedit hic! Sapiente veritatis totam at?
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, culpa ullam, voluptatem odit, sunt veritatis facere accusamus maiores odio assumenda sequi est vero amet impedit hic! Sapiente veritatis totam at?
          </p>
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