'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { contactFormSchema } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Form} from '@/components/ui/form';
import FormButton from '@/components/FormButton';
import ContactForm from '@/components/ContactForm';
import { sendContactEmail } from '@/lib/actions/userActions';
import { toast } from '@/hooks/use-toast';

const Contact = () => {

    const [isLoading, setIsLoading] = useState(false);

    const formSchema = contactFormSchema;



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
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            const response = await sendContactEmail(values);

            if(response === 'success') {
                toast({
                    description: 'Message sent successfully'
                });
            }
        } catch (error) {
            console.error('Error sending contact email', error);
        } finally {
            form.reset();
            setIsLoading(false)
        }
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
            className='w-full h-full flex flex-co lg:justify-between lg:flex-row py-16 px-[29px] lg:px-[68px] xl:px-[160px] bg-dark-gradient-180deg' 
        >
            <div className='md:w-[65%] lg:w-1/2 md:mx-auto lg:mx-0'>
            <div className="flex flex-col justify-center gap-10 mx-auto">
                <p className='text-color-60'></p>

                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>

                    <div className=" h-auto flex flex-col justify-center item-center gap-3">
                    <ContactForm 
                        control={form.control}
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