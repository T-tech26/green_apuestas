import React from 'react'
import HomeHeader from './HomeHeader'
import HomeContent from './HomeContent'

const HomeMain = () => {

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