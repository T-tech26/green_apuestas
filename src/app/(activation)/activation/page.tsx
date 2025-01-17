"use client"

import React, { useEffect, useState } from 'react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import LiveChat from '@/components/LiveChat'
import FormButton from '@/components/FormButton'
import { Input } from '@/components/ui/input'
import { activateSubscription } from '@/lib/actions/userActions'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@/contexts/child_context/userContext'
import { UserData } from '@/types/globals'
import Image from 'next/image'


const Activation = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [showHelpMessage, setShowHelpMessage] = useState(false);

  const { admin, user, setUser, loginUser, loginUserLoading } = useUser();

  const { toast } = useToast();


  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
      if(!admin.label.length && typeof user !== 'object') {
          loginUser();
      }

      if((admin.label.length || typeof user === 'object') && !loginUserLoading) {
          if((user as UserData)?.subscription === false) { redirect('/subscription'); } 
    
          if((user as UserData)?.subscription === true) { redirect('/'); } 
    
          if(admin.label.length) { redirect('/dashboard') }
      }


      if (typeof user !== 'object' && !loginUserLoading) {
        redirect('/signin'); 
      }
      
  }, [loginUserLoading]);
  /* eslint-enable react-hooks/exhaustive-deps */



  const formSchema = z.object({
    activation_pin: z.string().min(6, { message: "Pin must be 6 digit" }).max(6, { message: "Pin must be 6 digit" }),
  })


  
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activation_pin: "",
    },
  })
 


  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    if(user) {

      const id = (user as UserData)?.$id;
      
      setIsLoading(true)
      try {
          const response = await activateSubscription(id, values.activation_pin, '');

          if(typeof response === 'string') {
            toast({
              description: response
            })
          }
        
          if(typeof response === 'object' && typeof response !== null) setUser(response);
          
      } catch (error) {
        console.error("Error submitting activation code ", error);
      } finally {
        form.reset();
        setIsLoading(false)
      }
    }
  }



  return (
    <section className='w-full h-screen bg-dark-gradient-135deg flex flex-col'>
      
      {typeof user !== 'object' ? (
        <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-dark-gradient-135deg flex justify-center items-center">
          <Loader2 size={60} className="animate-spin text-color-30" />
        </div>
      ) : (
        <>
          <header className="w-full h-auto px-[15px] md:px-20 pt-7 flex justify-between item-center">
            <Image
                src='/logo-light.png'
                width={100}
                height={100}
                alt='light version logo'
            />

            <LanguageSwitcher />
          </header>

          <main className="flex-1 flex flex-col items-center justify-center gap-5">
            <h1 className='text-color-30 text-2xl md:text-3xl'>
              Green Apuestas activation pin
            </h1>

            <div className="flex flex-col justify-between item-center gap-10 w-4/5 md:w-[500px]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  
                  <div className="h-auto flex flex-col justify-center item-center gap-3">

                    <FormField
                      control={form.control}
                      name='activation_pin'
                      render={({ field }) => (
                          <div className='flex flex-col gap-2 w-full'>
                              <FormLabel
                                  className='text-color-30 text-base lg:text-base font-normal'
                              >
                                  Activation pin
                              </FormLabel>

                              <FormControl>
                                  <Input
                                    id='activation_pin'
                                    placeholder='Enter your pin'
                                    type='text'
                                    {...field}
                                    className='input'
                                    onFocus={() => form.trigger('activation_pin')}
                                  />
                              </FormControl>
                              <FormMessage />
                          </div>
                      )}
                    />

                    <FormButton loading={isLoading} text='Submit' />

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

                <p className='text-color-30'>
                    {showHelpMessage &&
                      'Contact our live chat to get instructions on how to get your Subscription pin.'
                    }
                </p>
              </div>
            </div>

          </main>

          <LiveChat />
        </>
      )}

    </section>
  )
}

export default Activation