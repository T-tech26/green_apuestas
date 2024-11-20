'use client'

import Bets from '@/components/Bets';
import HomeMain from '@/components/HomeMain';
import Leagues from '@/components/Leagues';
import MobileBets from '@/components/MobileBets';
import MobileHomeMenu from '@/components/MobileHomeMenu'
import MobileLeagues from '@/components/MobileLeagues';
import React, { useState } from 'react'

const Home = () => {

  const [selectedLink, setSelectedLink] = useState<string>('Home');


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