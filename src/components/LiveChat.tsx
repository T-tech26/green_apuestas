import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const LiveChat = () => {
  return (
    <Link
        href='https://wa.me/34651024934'
        className='fixed bottom-8 right-8'
      >
        <Image
          src='/whatsapp.png'
          width={50}
          height={50}
          alt='whatsapp contact'
        />
      </Link>
  )
}

export default LiveChat