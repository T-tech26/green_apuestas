'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { authFormSchema } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import CustomInput from '@/components/CustomInput';
import FormButton from '@/components/FormButton';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {

  const type = 'contact';
  const formSchema = authFormSchema(type);

  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      message: '',
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
    <main className='flex-1'>
      <div className='w-full h-auto relative'>
        <h1 
          className='text-color-30 text-xl md:text-3xl font-medium absolute w-full h-full bg-opacity-30 bg-color-60 flex justify-center items-center'
        >
          GET IN TOUCH WITH US
        </h1>
      
        <Image
          src='/contact-header-img.svg'
          width={100}
          height={100}
          alt='contact header image'
          className='w-full h-auto'
        />
      </div>

      <div
        className='w-full h-full flex flex-col lg:justify-between lg:flex-row py-10 px-[29px] lg:px-[68px] xl:px-[160px] bg-dark-gradient-180deg' 
      >
        <div className='md:w-[65%] lg:w-1/2 md:mx-auto lg:mx-0'>
          <div className="flex flex-col justify-center gap-10 mx-auto">

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                
                <div className=" h-auto flex flex-col justify-center item-center gap-3">

                  <div className="flex flex-col gap-3 md:gap-3 md:flex-row w-full">
                    <CustomInput 
                      control={form.control}
                      name='firstname'
                      label=''
                      placeholder='first name'
                    />

                    <CustomInput 
                      control={form.control}
                      name='lastname'
                      label=''
                      placeholder='last name'
                    />
                  </div>

                  <div className="flex flex-col gap-3 md:gap-3 md:flex-row w-full">
                    <CustomInput 
                      control={form.control}
                      name='email'
                      label=''
                      placeholder='email address'
                    />

                    <CustomInput 
                      control={form.control}
                      name='phone'
                      label=''
                      placeholder='phone number'
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Write your message......."
                            className='input w-full h-28'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormButton loading={isLoading}  text='Send message'/>

                </div>
              </form>
            </Form>
          </div>
        </div>

        <div className='lg:w-1/2 hidden lg:block'>
          <Image
            src='/contact-illustration.svg'
            width={100}
            height={100}
            alt='contact illustration'
            className='w-[90%] h-auto mx-auto'
          />
        </div>
      </div>
    </main>
  )
}

export default Contact