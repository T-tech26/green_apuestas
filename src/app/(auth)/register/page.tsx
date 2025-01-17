'use client'

import CustomInput from '@/components/CustomInput';
import Footer from '@/components/Footer';
import FormButton from '@/components/FormButton';
import LiveChat from '@/components/LiveChat';
import { Button } from '@/components/ui/button';
import { register } from '@/lib/actions/userActions';
import { authFormSchema } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { countries } from '@/lib/countries';
import { useUser } from '@/contexts/child_context/userContext';
import { useToast } from '@/hooks/use-toast';
import { UserData } from '@/types/globals';


const Register = () => {

  const formSchema = authFormSchema;

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<number>(1);

  const { user, setUser, admin, loginUser, loginUserLoading } = useUser();
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
  }, [loginUserLoading, user, admin]);
  /* eslint-enable react-hooks/exhaustive-deps */


  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

    const firstForm: ("password" | "firstname" | "lastname")[] = ['password', 'firstname', 'lastname'];
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
 


  const onSubmit = async (data: z.infer<typeof formSchema>) => {

    const { password, firstname, lastname, phone, email, dateOfBirth, country, state, city } = data;

    if(step === 3) {
      setIsLoading(true);
      try {
        const response = await register({
          password, firstname, lastname, phone, email, dateOfBirth, country, state, city
        });

        if(typeof response === 'string') {
          toast({
            description: response
          })
          return;
        }

        if(typeof response === 'object') {
          toast({
            description: 'Account created successfully'
          });
          
          setUser(response);
        }

      } catch (error) {
        console.error("Registration error", error);
      } finally {
        form.reset()
        setIsLoading(false);
      }
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
                    trigger={form.trigger}
                    name='firstname'
                    label='First name'
                    placeholder='firstname'
                  />

                  <CustomInput 
                    control={form.control}
                    trigger={form.trigger}
                    name='lastname'
                    label='Last name'
                    placeholder='lastname'
                  />

                  <CustomInput 
                    control={form.control}
                    trigger={form.trigger}
                    name='password'
                    label='Password'
                    placeholder='password'
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
                    trigger={form.trigger}
                    name='phone'
                    label='Phone number'
                    placeholder='+1 763 872 987'
                  />

                  <CustomInput 
                    control={form.control}
                    trigger={form.trigger}
                    name='email'
                    label='Email'
                    placeholder='email'
                  />

                  <CustomInput 
                    control={form.control}
                    trigger={form.trigger}
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
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <div className='flex flex-col gap-2 w-full'>
                        <FormLabel className='text-color-30 text-base lg:text-base font-normal'>
                          Country
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='bg-color-30 border-b-4 border-b-color-10 focus:outline-none px-4 py-2 lg:py-[10px] rounded-tr-2xl rounded-bl-2xl placeholder:text-color-60 placeholder:text-sm lg:placeholder:text-base text-color-60 mb-2 flex justify-between items-center'>
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='overflow-y-scroll h-52 bg-color-30'>
                            {countries.map((item) => {
                              return (
                                <SelectItem className='cursor-pointer' key={item.name} value={item.name}>{item.name}</SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    )}
                  />

                  <CustomInput 
                    control={form.control}
                    trigger={form.trigger}
                    name='state'
                    label='State'
                    placeholder='state'
                  />

                  <CustomInput 
                    control={form.control}
                    trigger={form.trigger}
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