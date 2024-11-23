'use client'

import Bets from '@/components/Bets';
import HomeMain from '@/components/HomeMain';
import Leagues from '@/components/Leagues';
import MobileBets from '@/components/MobileBets';
import MobileHomeMenu from '@/components/MobileHomeMenu'
import MobileLeagues from '@/components/MobileLeagues';
import { useUser } from '@/contexts/child_context/userContext';
import { toast } from '@/hooks/use-toast';
import { getLoggedInUser } from '@/lib/actions/userActions';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Home = () => {

  const [selectedLink, setSelectedLink] = useState<string>('Home');

  const { user, setUser } = useUser();



  useEffect(() => {
    const loggIn = async () => {
        const response = await getLoggedInUser();

        if(typeof response === 'string') {
          toast({
            description: response
          })
        }

        if(typeof response === 'object') setUser((response as any));
    }

    loggIn()
  }, [])


  if(user) {
    if((user as any)?.doucuments[0].subscription === false) {
      redirect('/subscription');
    }
  }


  return (
    <main
      className='flex-1 flex justify-between gap-4 bg-dark-gradient-180deg-reverse'
    >
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
    </main>
  )
}

export default Home