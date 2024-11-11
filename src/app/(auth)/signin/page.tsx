'use client'

import CustomInput from '@/components/CustomInput'
import Footer from '@/components/Footer'
import FormButton from '@/components/FormButton'
import LiveChat from '@/components/LiveChat'
import { Form } from '@/components/ui/form'
import { authFormSchema } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Signin = () => {

  const type = 'signin';
  const formSchema = authFormSchema(type);

  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true)
    console.log(values)
    setIsLoading(false)
  }


  return (
    <>
      <main className='flex flex-col justify-center items-center w-full h-screen bg-dark-gradient-135deg'>
        
        <h1 className='text-color-30 text-2xl md:text-3xl mb-8'>Login to your account</h1>

        <div className="flex flex-col justify-center item-center gap-10 w-4/5 md:w-[500px]">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              
              <div className=" h-auto flex flex-col justify-center item-center gap-3">

                <CustomInput 
                  control={form.control}
                  name='username'
                  label='Username'
                  placeholder='username'
                />

                <CustomInput 
                  control={form.control}
                  name='password'
                  label='Password'
                  placeholder='password'
                />

                <FormButton loading={isLoading}  text='Sigin'/>

              </div>
            </form>
          </Form>

          <p className='text-color-30 text-center text-sm'>
            Don&apos;t have an account? &nbsp; 
            <Link 
              href='/register'
              className='text-color-10 underline'
            >
              Register Now
            </Link>
          </p>
        </div>
      </main>

      <Footer />

      <LiveChat />
    </>
  )
}

export default Signin