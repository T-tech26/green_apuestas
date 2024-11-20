'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormMessage } from './ui/form';
import { Input } from './ui/input';
import FormButton from './FormButton';

const Bets = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedButton, setSelectedButton] = useState<string | null>('Open Bets')

  const formSchema = z.object({
    betId: z.string().min(6, {
        message: "Betslip code must be 6 digits"
    }).max(6, {
        message: "Betslip code must be 6 digits"
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
          betId: "",
      },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      setIsLoading(true)
      console.log(values)
      form.reset();
      setIsLoading(false)
  }

  return (
    <aside
      className='w-[281px] lg:flex justify-center items-center bg-light-gradient-180deg-reverse px-[29px] py-8 hidden h-[550px]'
    >
      <div
        className='bg-color-30 rounded-t-lg h-full'
      >
        <div className='w-full'>
          <Button
            type='button'
            className={`bg-color-60 text-color-30 rounded-br-none rounded-bl-none rounded-tr-none rounded-tl-lg border-b-2 border-color-10 w-1/2 hover:bg-color-60 ${
              selectedButton === 'Betslip' ? 'bg-color-30 hover:bg-color-30 text-color-60' : ''
            }`}
            onClick={() => setSelectedButton('Betslip')}
          >
            Betslip
          </Button>

          <Button
            type='button'
            className={`bg-color-60 text-color-30 rounded-br-none rounded-bl-none rounded-tl-none rounded-tr-lg border-b-2 border-color-10 w-1/2 hover:bg-color-60 ${
              selectedButton === 'Open Bets' ? 'bg-color-30 hover:bg-color-30 text-color-60' : ''
            }`}
            onClick={() => setSelectedButton('Open Bets')}
          >
            Open Bets
          </Button>
        </div>

        <div
          className='flex flex-col justify-center items-center h-full'
        >
          {
            selectedButton === 'Open Bets' && <p className='text-color-60 font-medium'>No bets</p>
          }
          
          {
            selectedButton === 'Betslip' &&
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                  
                  <div className="h-auto flex flex-col justify-center item-center gap-3 px-5">

                  <FormField
                      control={form.control}
                      name='betId'
                      render={({ field }) => (
                          <div className='flex flex-col gap-2 w-full'>
                              <FormControl>
                                  <Input
                                  placeholder='234187'
                                  {...field}
                                  className='py-3 px-3 placeholder:text-color-60 text-sm rounded-lg drop-shadow-sm focus:border-none focus:outline-none'
                                  />
                              </FormControl>
                              <FormMessage />
                          </div>
                      )}
                  />

                      <FormButton loading={isLoading} text='Get slip'/>

                  </div>
                  </form>
              </Form>
          }
        </div>
      </div>
    </aside>
  )
}

export default Bets