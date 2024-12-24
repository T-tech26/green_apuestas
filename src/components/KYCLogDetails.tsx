import { UserData, VerificationDocument } from '@/types/globals'
import Image from 'next/image'
import React from 'react'



interface DocWithUser {
    doc: VerificationDocument,
    user: UserData
}



interface KYCLogDetailsProps {
    logDetails: DocWithUser | string,
    setLogDetails: (newLogDetails: DocWithUser | string) => void
}


const KYCLogDetails = ({ logDetails, setLogDetails }: KYCLogDetailsProps) => {


    return (
        <main className='fixed top-0 right-0 left-0 bottom-0 bg-color-60 bg-opacity-30 overflow-y-scroll flex flex-col items-center gap-10 py-14'>

            <Image 
                src='/close.svg'
                width={25}
                height={25}
                alt='Close icon'
                className='absolute top-5 right-5 cursor-pointer'
                onClick={() => setLogDetails('')}
            />

            <div className='w-4/5 h-auto px-5 py-10 bg-color-30 rounded-md flex flex-col gap-5'>
                <p className='border border-color-10 rounded-md px-3 py-2 text-sm text-color-60 relative'>
                    <span className='absolute -top-[13px] left-3 text-color-30 pb-1 text-xs bg-light-gradient-135deg px-3 rounded-sm'>Name</span>
                    {(logDetails as DocWithUser).user.firstname} {(logDetails as DocWithUser).user.lastname}
                </p>
                
                <div className='flex items-center gap-3 flex-wrap'>
                    <p className='border border-color-10 rounded-md px-3 py-2 text-sm text-color-60 min-w-28 flex-grow relative'>
                        <span className='absolute -top-[13px] left-3 text-color-30 pb-1 text-xs bg-light-gradient-135deg px-3 rounded-sm'>Date of birth</span>
                        {(logDetails as DocWithUser).user.dateOfBirth}
                    </p>
                    <p className='border border-color-10 rounded-md px-3 py-2 text-sm text-color-60 min-w-28 flex-grow relative'>
                        <span className='absolute -top-[13px] left-3 text-color-30 pb-1 text-xs bg-light-gradient-135deg px-3 rounded-sm'>Country</span>
                        {(logDetails as DocWithUser).user.country}
                    </p>
                    <p className='border border-color-10 rounded-md px-3 py-2 text-sm text-color-60 min-w-28 flex-grow relative'>
                        <span className='absolute -top-[13px] left-3 text-color-30 pb-1 text-xs bg-light-gradient-135deg px-3 rounded-sm'>State</span>
                        {(logDetails as DocWithUser).user.state}
                    </p>
                    <p className='border border-color-10 rounded-md px-3 py-2 text-sm text-color-60 min-w-28 flex-grow relative'>
                        <span className='absolute -top-[13px] left-3 text-color-30 pb-1 text-xs bg-light-gradient-135deg px-3 rounded-sm'>City</span>
                        {(logDetails as DocWithUser).user.city}
                    </p>
                </div>
            </div>

            <div className='w-4/5 h-auto px-5 py-8 bg-color-30 rounded-md flex flex-col gap-3'>
                <p className='text-color-60 text-sm'>Document front</p>
                {/* eslint-disable @next/next/no-img-element */}
                <img
                    src={(logDetails as DocWithUser).doc.frontUrl ? (logDetails as DocWithUser).doc.frontUrl : ''}
                    width={100}
                    height={100}
                    alt='front of docuement'
                    className='w-full h-auto'
                />
                {/* eslint-enable @next/next/no-img-element */}
            </div>
            
            <div className='w-4/5 h-auto px-5 py-8 bg-color-30 rounded-md flex flex-col gap-3'>
                <p className='text-color-60 text-sm'>Document back</p>
                {/* eslint-disable @next/next/no-img-element */}
                <img
                    src={(logDetails as DocWithUser).doc.backUrl ? (logDetails as DocWithUser).doc.backUrl : ''}
                    width={100}
                    height={100}
                    alt='front of docuement'
                    className='w-full h-auto'
                />
                {/* eslint-enable @next/next/no-img-element */}
            </div>
        </main>
    )
}

export default KYCLogDetails