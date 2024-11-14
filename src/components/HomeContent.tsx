import React from 'react'
import LiveEvents from './LiveEvents'
import TodayEvents from './TodayEvents'
import TomorrowEvents from './TomorrowEvents'

const HomeContent = () => {
  return (
    <div className='flex flex-col gap-5'>
        <LiveEvents />
        <TodayEvents />
        <TomorrowEvents />
    </div>
  )
}

export default HomeContent