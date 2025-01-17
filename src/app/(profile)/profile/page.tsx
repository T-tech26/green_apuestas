'use client'
import LiveChat from '@/components/LiveChat'
import CityForm from '@/components/profileForms/CityForm'
import CountryForm from '@/components/profileForms/CountryForm'
import DateOfBirthForm from '@/components/profileForms/DateOfBirthForm'
import EmailForm from '@/components/profileForms/EmailForm'
import FirstNameForm from '@/components/profileForms/FirstNameForm'
import LastNameForm from '@/components/profileForms/LastNameForm'
import PhoneNumberForm from '@/components/profileForms/PhoneNumberForm'
import StateForm from '@/components/profileForms/StateForm'
import { useUser } from '@/contexts/child_context/userContext'
import React from 'react'


const Profile = () => {

  const { user, setUser } = useUser();
    
  return (
    <main className='flex-1 py-14 overflow-y-scroll'>
      <div className='w-4/5 mx-auto flex flex-col gap-4'>
        <h1 className='text-lg text-color-60 font-medium mb-5'>PROFILE</h1>
        
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

      <LiveChat />
    </main>
  )
}

export default Profile