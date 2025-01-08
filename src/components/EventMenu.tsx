import { EventMenuLinks } from '@/constants'
import React from 'react'
import { Button } from './ui/button'

interface EventMenuProps {
    selectedEvent: string;
    setSelectedEvent: (link: string) => void;
}

const EventMenu = ({ selectedEvent, setSelectedEvent }: EventMenuProps) => {

  return (
    <nav
        className='w-full h-auto flex flex-wrap'
    >
        {EventMenuLinks.map((link) => {
            return (
                <Button
                    key={link.name}
                    className={`text-color-30 min-w-[81px] md:w-28 bg-dark-gradient-135deg rounded-none border-r-2 border-color-10 hover:bg-light-gradient-135deg ${
                        selectedEvent === link.name ? 'bg-light-gradient-135deg' : ''
                    } ${
                        link.name === 'Upcoming' && 'border-none'
                    }`}
                    onClick={() => setSelectedEvent(link.name)}
                >
                    {link.name}
                </Button>
            )
        })}
    </nav>
  )
}

export default EventMenu