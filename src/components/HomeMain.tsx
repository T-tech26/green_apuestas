import React, { useState } from 'react'
import HomeHeader from './HomeHeader'
import EventMenu from './EventMenu'
import HomeContent from './HomeContent'

const HomeMain = () => {

    const [selectedEvent, setSelectedEvent] = useState<string>('All');

    return (
        <main
            className='flex-1 flex flex-col gap-4 px-[15px] py-[15px]'
        >
            <HomeHeader />
            <HomeContent />
        </main>
    )
}

export default HomeMain