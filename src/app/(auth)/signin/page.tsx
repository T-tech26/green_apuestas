'use client'

import Footer from '@/components/Footer'
import LiveChat from '@/components/LiveChat'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUser } from '@/contexts/child_context/userContext'
import { useToast } from '@/hooks/use-toast'
import { getAllUsers, getLoggedInUser, sendPasswordRecoveryEmail, signin } from '@/lib/actions/userActions'
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
    const [inputEmailLoading, setInputEmailLoading] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [inputEmail, setInputEmail] = useState('');

    const { user, setUser, admin, setAdmin, setAllUsers, loginUser, loginUserLoading } = useUser();

    const { toast } = useToast();


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if(!admin.label.length && typeof user !== 'object') {
            loginUser();
            return;
        }
        
        if(typeof user === 'object') {
            if((user as UserData)?.subscription === false) { redirect('/activation'); return; } 
    
            if((user as UserData)?.subscription === true) { redirect('/'); return; } 
        }

        if(admin.label.length) {
            if(admin.label[0] === 'admin') { redirect('/dashboard'); }
            if(admin.label[0] === 'editor') { redirect('/user-bet-history'); }
        }
    }, [loginUserLoading, user, admin]);
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
  

    const sendRecoveryEmail = async () => {
        setInputEmailLoading(true);
        try {
            if(!inputEmail) { toast({ description: 'Please provide your email' }); return; }

            const emailSent = await sendPasswordRecoveryEmail(inputEmail);

            if(emailSent !== 'success') { toast({ description: emailSent }); return; }

            toast({ description: 'A password recovery email will be sent to your email.' });
            setForgotPassword(false);
        } catch (error) {
            console.error('Error sending password recovery email', error);
        } finally {
            setInputEmail('');
            setInputEmailLoading(false);
        }
    }

    
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
                });
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
      <section>
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

                        
                        <Button type='submit' 
                            disabled={isLoading}
                            className='bg-light-gradient-135deg text-lg text-color-30 rounded-full'
                        >
                            {isLoading ? 'Loading' : 'Signin'}
                        </Button>

                        </div>
                    </form>
                </Form>

                <p 
                    className='text-center text-sm text-color-10 underline cursor-pointer'
                    onClick={() => setForgotPassword(true)}
                >
                    Forgot password
                </p>

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

        {forgotPassword && (
            <main className='fixed top-0 right-0 left-0 bottom-0 bg-color-60 bg-opacity-50 grid place-items-center py-14'>
                <div 
                    className='relative w-[95%] md:w-4/5 md:max-w-[700px] bg-color-30 rounded-md flex flex-col gap-5 justify-between p-5'
                >
                    <p className='text-color-60 text-sm'>
                        Enter your email, a one time password reset link will be sent to your email address from appwrite.
                    </p>

                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <Input 
                            id='passwordEmail'
                            type='email'
                            value={inputEmail}
                            placeholder='Enter verification pin'
                            className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm text-sm flex-1'
                            onChange={e => setInputEmail(e.target.value)}
                        />

                        <Button
                            disabled={inputEmailLoading}
                            type='button'
                            className='min-w-28 h-8 bg-light-gradient-135deg text-sm text-color-30 rounded-full'
                            onClick={() => {
                                sendRecoveryEmail();
                            }}
                        >
                            {inputEmailLoading ? 'Loading' : 'Submit'}
                        </Button>
                    </div>
                </div>
            </main>
        )}

        <Footer />

        <LiveChat />
      </section>
    )
}

export default Signin