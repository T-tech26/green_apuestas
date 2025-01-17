'use client'

import Footer from '@/components/Footer'
import FormButton from '@/components/FormButton'
import LiveChat from '@/components/LiveChat'
import { Form, FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUser } from '@/contexts/child_context/userContext'
import { useToast } from '@/hooks/use-toast'
import { getAllUsers, getLoggedInUser, signin } from '@/lib/actions/userActions'
import { isAdmin, isUserData, loggedInAdminWithImage, loggedInUserWithImage } from '@/lib/utils'
import { UserData } from '@/types/globals'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Signin = () => {

    const [isLoading, setIsLoading] = useState(false);

    const { user, setUser, admin, setAdmin, setAllUsers, loginUser, loginUserLoading } = useUser();

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
    }, [loginUserLoading]);
    /* eslint-enable react-hooks/exhaustive-deps */
    


    const formSchema = z.object({
      email: z.string().email({ message: "Enter a valid email address" }),
      password: z.string().min(8),
    })



    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: '',
        password: ''
      },
    })
  

    
    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            const response = await signin(values.email, values.password);

            if(typeof response === 'string') {
                toast({
                    description: response
                })
                return;
            }

            if(typeof response !== 'string') {
                toast({
                    description: 'Login successfully'
                })
            }

            const loggedIn = await getLoggedInUser();

        if(isAdmin(loggedIn)) { 
            const users = await getAllUsers();
            setAllUsers(users);
            const adminWithImage = loggedInAdminWithImage(loggedIn);
            setAdmin(adminWithImage);
            return;
        }

        if(isUserData(loggedIn)) { 
            const userWithImage = loggedInUserWithImage(loggedIn);
            setUser(userWithImage);
        }

        } catch (error) {
            console.error("Error signing in ", error);
        } finally {
            form.reset();
            setIsLoading(false)
        }
    }

      

    return (
      <>
        <main className='flex flex-col justify-center items-center w-full h-screen bg-dark-gradient-135deg'>
          
            <h1 className='text-color-30 text-2xl md:text-3xl mb-8'>Login to your account</h1>

            <div className="flex flex-col justify-center item-center gap-10 w-4/5 md:w-[500px]">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        
                        <div className=" h-auto flex flex-col justify-center item-center gap-3">

                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <div className='flex flex-col gap-2 w-full'>
                                    <FormLabel
                                        className='text-color-30 text-base lg:text-base font-normal'
                                    >
                                        Email
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            id='email'
                                            placeholder='email address'
                                            type='email'
                                            {...field}
                                            className='input'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <div className='flex flex-col gap-2 w-full'>
                                    <FormLabel
                                        className='text-color-30 text-base lg:text-base font-normal'
                                    >
                                        Password
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            id='password'
                                            placeholder='password'
                                            type='password'
                                            {...field}
                                            className='input'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
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