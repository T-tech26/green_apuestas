'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@/contexts/child_context/userContext'
import { useRouter } from 'next/navigation'
import Translator from '@/components/Translator'


const Subscritpion = () => {
    const { admin, user, loginUser, loginUserLoading } = useUser();
    const router = useRouter();


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if(!admin.label.length && typeof user !== 'object') {
            loginUser();
        }
        if((admin.label.length || typeof user === 'object') && !loginUserLoading) {
            if(typeof user === 'object') { router.push('/'); } 
        
            if(admin.label.length) { router.push('/dashboard') }
        }
    }, [loginUserLoading]);
    /* eslint-enable react-hooks/exhaustive-deps */



    return (
        <section className='w-full h-screen bg-subscription-bg bg-no-repeat bg-center bg-cover'>
            <div
                className='bg-color-60 bg-opacity-30 w-full h-full flex flex-col'
            >
                <header className="w-full h-auto px-[15px] md:px-20 pt-7 flex justify-between items-center">
                    <Link href='/'>
                        <Image
                            src='/logo-dark.png'
                            width={100}
                            height={100}
                            alt='light version logo'
                            className='w-[100px] h-[50px]'
                        />
                    </Link>

                    <Translator />
                </header>
                <main className="flex-1 flex flex-col items-center justify-center gap-5">
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
                </main>
            </div>
        </section>

    )
}
export default Subscritpion