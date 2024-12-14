'use client'

import CityForm from '@/components/profileForms/CityForm'
import CountryForm from '@/components/profileForms/CountryForm'
import DateOfBirthForm from '@/components/profileForms/DateOfBirthForm'
import EmailForm from '@/components/profileForms/EmailForm'
import FirstNameForm from '@/components/profileForms/FirstNameForm'
import LastNameForm from '@/components/profileForms/LastNameForm'
import PhoneNumberForm from '@/components/profileForms/PhoneNumberForm'
import StateForm from '@/components/profileForms/StateForm'
import { useUser } from '@/contexts/child_context/userContext'
import { Loader2 } from 'lucide-react'
import React from 'react'


const Profile = () => {

    const { user, setUser } = useUser();
    

    if (typeof user !== 'object') {
      return (
        <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-dark-gradient-135deg flex justify-center items-center">
          <Loader2 size={60} className="animate-spin text-color-30" />
        </div>
      );
    }

    return (
      <>
        {typeof user === 'object' && (
          <main className='flex-1 py-14 overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-4'>
              <h1 className='text-lg text-color-60 font-medium mb-5'>Profile</h1>
              
              <FirstNameForm
                user={user}
                setUser={setUser}
              />
          
              <LastNameForm
                user={user}
                setUser={setUser}
              />

              <EmailForm
                user={user}
                setUser={setUser}
              />

              <PhoneNumberForm
                user={user}
                setUser={setUser}
              />

              <DateOfBirthForm
                user={user}
                setUser={setUser}
              />

              <CountryForm
                user={user}
                setUser={setUser}
              />

              <StateForm
                user={user}
                setUser={setUser}
              />

              <CityForm
                user={user}
                setUser={setUser}
              />

            </div>
          </main>
        )}
      </>
    )
}

export default Profile