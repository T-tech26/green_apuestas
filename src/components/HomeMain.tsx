import React from 'react'
import HomeHeader from './HomeHeader'
import EventMenu from './EventMenu'
import HomeContent from './HomeContent'

const HomeMain = () => {
  return (
    <main
        className='flex-1 flex flex-col gap-4 px-[15px] lg:px-0 py-[15px]'
    >
        <HomeHeader />
        <EventMenu />
        <HomeContent />
    </main>
  )
}

export default HomeMain