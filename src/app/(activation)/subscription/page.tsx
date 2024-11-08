import React from 'react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import Link from 'next/link'
import Image from 'next/image'

const Subscritpion = () => {
  return (
    <section className='w-full h-screen bg-subscription-bg bg-no-repeat bg-center bg-cover'>
      <div
        className='bg-color-60 bg-opacity-30 w-full h-full flex flex-col'
      >
        <div className="w-full h-auto px-[15px] md:px-20 pt-7 flex justify-between item-center">
          <h1 className='text-color-30 text-xl'>LOGO</h1>

          <LanguageSwitcher />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          <Link
            href='/activation'
            className='subscription-btn'
            >
            Weekly Subscription

            <Image
              src='/arrow_right_alt.svg'
              alt='arrow right'
              width={24}
              height={24}
            />
          </Link>

          <Link
            href='/activation'
            className='subscription-btn'
          >
            Monthly Subscription

            <Image
              src='/arrow_right_alt.svg'
              alt='arrow right'
              width={24}
              height={24}
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Subscritpion