import React from 'react'
import LiveEvents from './LiveEvents'
import TodayEvents from './TodayEvents'
import TomorrowEvents from './TomorrowEvents'
import OtherDayEvents from './OtherDayEvents'

interface HomeContentProps {
  selectedEvent: string
}

const HomeContent = ({ selectedEvent }: HomeContentProps) => {

  return (
    <div className='flex flex-col gap-5'>
        {selectedEvent === 'All' && (
          <>
            <LiveEvents selectedEvent={selectedEvent} />
            <TodayEvents />
            <TomorrowEvents />
            <OtherDayEvents />
          </>
        )}
        {selectedEvent === 'Live' && (
          <LiveEvents selectedEvent={selectedEvent} />
        )}
        {selectedEvent === 'Today' && (
          <TodayEvents />
        )}
        {selectedEvent === 'Tomorrow' && (
          <TomorrowEvents />
        )}
    </div>
  )
}

export default HomeContent