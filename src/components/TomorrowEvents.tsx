import React from 'react'
import { Button } from './ui/button'
import { TomorrowMatches } from '@/constants'

const TomorrowEvents = () => {
  return (
    <div>
        <div
            className='flex mb-3 pr-4 md:pr-3'
        >
            <p className='text-color-30 text-sm italic flex-1'>Tomorrow</p>
            <p className='text-color-30 text-sm italic w-14 md:w-16 text-center'>Home</p>
            <p className='text-color-30 text-sm italic w-14 md:w-16 text-center'>Draw</p>
            <p className='text-color-30 text-sm italic w-14 md:w-16 text-center'>Away</p>
        </div>

        <div>
            {TomorrowMatches.map((data) => {
                return (
                    <div
                        key={data.time}
                        className='px-3 py-1 bg-color-30 border-b-2 border-color-60 flex justify-evenly items-center gap-3'
                    >
                        <span className='score'>{data.time}</span>

                        <div className='team-container'>
                            <span className='team'>{data.home}</span>
                            <span className='score !text-color-60 hidden md:block lg:hidden xl:block'>vs</span>
                            <span className='team'>{data.away}</span>
                        </div>

                        <div>
                            <Button
                                className='odds-btn !rounded-tl-2xl !rounded-bl-2xl'
                            >
                                {data.homeOdd}
                            </Button>
                            <Button className='odds-btn border-l-2 border-r-2 border-color-10'>
                                {data.drawOdd}
                            </Button>
                            <Button className='odds-btn !rounded-tr-2xl !rounded-br-2xl'>
                                {data.awayOdd}
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default TomorrowEvents