"use client"

import React, { useState } from 'react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from '@/components/CustomInput'
import { Loader2 } from 'lucide-react'
import LiveChat from '@/components/LiveChat'
import { authFormSchema } from '@/lib/utils'


const Activation = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [showHelpMessage, setShowHelpMessage] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      activation_pin: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof authFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true)
    console.log(values)
    setIsLoading(false)
  }

  return (
    <section className='w-full h-screen bg-dark-gradient-135deg flex flex-col'>
    
      <header className="w-full h-auto px-[15px] md:px-20 pt-7 flex justify-between item-center">
        <h1 className='text-color-30 text-xl'>LOGO</h1>

        <LanguageSwitcher />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-5">
        <h1 className='text-color-30 text-2xl md:text-3xl'>
          Green Apuestas activation pin
        </h1>

        <div className="flex flex-col justify-between item-center p-5 gap-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              
              <div className=" w-72 md:w-96 h-auto flex flex-col justify-center item-center gap-3">

                <CustomInput 
                  control={form.control}
                  name='activation_pin'
                  label='Activation pin'
                  placeholder='Enter your pin'
                />

                <Button type='submit' 
                  disabled={isLoading}
                  className='bg-light-gradient-135deg text-lg text-color-30 rounded-full'
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className='animate-spin'/> &nbsp; 
                      Loading...
                    </>
                  ): 'Submit'}
                </Button>

              </div>
            </form>
          </Form>

          <div className='flex flex-col gap-4'>
            <p className='text-color-30'>
              Don&apos;t know what to do click &nbsp; 
              <span 
                className='text-color-10 underline cursor-pointer'
                onClick={() => showHelpMessage ? setShowHelpMessage(false) : setShowHelpMessage(true)} 
              >here</span>
            </p>

            <p className='text-color-30 w-72 md:w-96'>
                {showHelpMessage &&
                  'Contact our live chat to get instructions on how to get your Subscription pin.'
                }
            </p>
          </div>
        </div>

      </main>

      <LiveChat />
    </section>
  )
}

export default Activation