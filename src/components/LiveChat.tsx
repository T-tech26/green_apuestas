import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const LiveChat = () => {
    return (
        <Link
            target='_blank'
            href='https://t.me/Futboladmn'
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
