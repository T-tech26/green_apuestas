'use client'

import CustomInput from '@/components/CustomInput';
import Footer from '@/components/Footer';
import FormButton from '@/components/FormButton';
import LiveChat from '@/components/LiveChat';
import { Button } from '@/components/ui/button';
import { authFormSchema } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const Register = () => {

  const type = 'register';
  const formSchema = authFormSchema(type);

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<number>(1);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      dateOfBirth: '',
      country: '',
      phone: '',
      state: '',
      city: '',
    },
  })


  const handleNextStep = () => {

    const firstForm: ("username" | "password" | "firstname" | "lastname")[] = ['username', 'password', 'firstname', 'lastname'];
  const secondForm: ("phone" | "email" | "dateOfBirth")[] = ['phone', 'email', 'dateOfBirth'];

    if (step === 1) {
      form.trigger(firstForm).then((isValid) => {
        if (isValid) {
          setStep(step + 1); // Proceed to next step if validation passes
        }
      });
    } else if (step === 2) {
      form.trigger(secondForm).then((isValid) => {
        if (isValid) {
          setStep(step + 1); // Proceed to next step if validation passes
        }
      });
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => setStep(step - 1);
 
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if(step === 3) {
      setIsLoading(true);
      console.log('Form Submitted:', values);
      form.reset()
      setIsLoading(false);
    }
  };


  return (
    <>
      <main className='flex flex-col justify-center w-full h-screen bg-dark-gradient-135deg'>
        
        <h1 className='text-color-30 text-center text-2xl md:text-3xl mb-4'>Create an account</h1>

        <div className="w-3/4 md:w-1/2 lg:w-2/5 mx-auto">

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              
              <div 
                className="flex flex-col justify-center item-center gap-2"
              >

              {step === 1 && (
                <>
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

                  <CustomInput 
                    control={form.control}
                    name='firstname'
                    label='First name'
                    placeholder='firstname'
                  />

                  <CustomInput 
                    control={form.control}
                    name='lastname'
                    label='Last name'
                    placeholder='lastname'
                  />

                  <p className='text-color-30 text-sm'>By creating an account you agree to accept our <span className='text-color-10'>Terms & Conditions,</span> and you are over 18 and are aware of our Responsible Gaming Policy</p>

                  <div
                    className='flex flex-col lg:flex-row gap-2 mt-3 items-center'
                  >
                    <Button type='button' 
                      className='bg-light-gradient-135deg text-lg text-color-30 rounded-full w-full lg:w-1/2'
                      onClick={handleNextStep}
                    >
                      Next
                    </Button>

                    <p className='text-color-30 text-sm text-center lg:w-1/2'>
                      Already have an account? &nbsp; 
                      <Link 
                        href='/signin'
                        className='text-color-10 underline'
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                </>
              )}
                
              {step === 2 && (
                <>
                  <CustomInput 
                    control={form.control}
                    name='phone'
                    label='Phone number'
                    placeholder='+1 763 872 987'
                  />

                  <CustomInput 
                    control={form.control}
                    name='email'
                    label='Email'
                    placeholder='email'
                  />

                  <CustomInput 
                    control={form.control}
                    name='dateOfBirth'
                    label='Date of birth'
                    placeholder='DD/MM/YY'
                  />

                  <div
                    className='flex gap-2 mt-3'
                  >
                    <Button type='button' 
                      className='bg-light-gradient-135deg text-lg text-color-30 rounded-full w-full'
                      onClick={handleNextStep}
                    >
                      Next
                    </Button>

                    <Button type='button' 
                      className='bg-light-gradient-135deg text-lg text-color-30 rounded-full w-full'
                      onClick={handlePrevStep}
                    >
                      Back
                    </Button>
                  </div>
                </>
              )}
                  
              {step === 3 && (
                <>
                  <CustomInput 
                    control={form.control}
                    name='country'
                    label='Country'
                    placeholder='country'
                  />

                  <CustomInput 
                    control={form.control}
                    name='state'
                    label='State'
                    placeholder='state'
                  />

                  <CustomInput 
                    control={form.control}
                    name='city'
                    label='City'
                    placeholder='city'
                  />

                  <FormButton loading={isLoading}  text='Register'/>
                </>
              )}

              </div>
            </form>
          </FormProvider>
        </div>
      </main>

      <Footer />

      <LiveChat />
    </>
  )
}

export default Register