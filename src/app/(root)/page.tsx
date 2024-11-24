'use client'

import Bets from '@/components/Bets';
import HomeMain from '@/components/HomeMain';
import Leagues from '@/components/Leagues';
import MobileBets from '@/components/MobileBets';
import MobileHomeMenu from '@/components/MobileHomeMenu'
import MobileLeagues from '@/components/MobileLeagues';
import { toast } from '@/hooks/use-toast';
import { getLoggedInUser } from '@/lib/actions/userActions';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Home = () => {

  const [selectedLink, setSelectedLink] = useState<string>('Home');
  const [loggedIn, setLoggedIn] = useState<object | string>('');
  const [isSubscriptionCheck, setIsSubscriptionCheck] = useState(false);



    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const loggIn = async () => {
            setIsSubscriptionCheck(true);
            const response = await getLoggedInUser();

            if(typeof response === 'object') setLoggedIn(response);
            if(typeof response !== 'object') setIsSubscriptionCheck(false);
        }

        loggIn()
    }, [])
    /* eslint-enable react-hooks/exhaustive-deps */



    if(loggedIn) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      if((loggedIn as any)?.subscription === false) {
        toast({
          description: 'You are not on subscription, please go and subscribe'
        })

        setTimeout(() => {
          setIsSubscriptionCheck(true);
          redirect('/subscription');
        }, 4000);
      }
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }



    return (
      <main
        className='flex-1 flex justify-between gap-4 bg-dark-gradient-180deg-reverse'
      >
        {isSubscriptionCheck ? (
        <div className='fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-dark-gradient-135deg flex justify-center items-center'>
          <Loader2 size={60} className='animate-spin text-color-30'/>
        </div>
      ) : (
        <>
          <Leagues />
          
          <HomeMain />

          <Bets />

          <MobileHomeMenu 
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
          />

          <MobileLeagues 
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
          />

          <MobileBets
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            type='Betslip'
          />

          <MobileBets 
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            type='Bets'
          />
        </>
      )}
      </main>
    )
}

export default Home