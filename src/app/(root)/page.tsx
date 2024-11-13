'use client'

import MobileBets from '@/components/MobileBets';
import MobileHomeMenu from '@/components/MobileHomeMenu'
import MobileLeagues from '@/components/MobileLeagues';
import React, { useState } from 'react'

const Home = () => {

  const [selectedLink, setSelectedLink] = useState<string | null>('Home');


  return (
    <main
      className='flex-1 flex gap-5 bg-dark-gradient-180deg-reverse'
    >
        <aside
          className='bg-light-gradient-180deg-reverse px-[29px] py-10 hidden md:block'
        >

        </aside>

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