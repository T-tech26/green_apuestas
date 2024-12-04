import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormMessage } from './ui/form';
import Image from 'next/image';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';

const IntlPayment = () => {

    const AddressType = [
        {
            id: '1',
            description: 'Email'
        },
        {
            id: '2',
            description: 'ID'
        },
    ]

    const imgRef = useRef<HTMLInputElement | null>(null);
    const [addressType, setAddressType] = useState('1');
    const [isLoading, setIsLoading] = useState(false);
    const [img, setImg] = useState('');

    const formSchema = z.object({
        name: z.string().min(3),
        email: z.string().min(3),
        logo: z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'File size must be less than or equal to 5MB',
            })
            .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
            message: 'File must be PNG or JPEG',
            }),

        minDeposit: z.string().min(3),
    });


    /* eslint-disable @typescript-eslint/no-explicit-any */
    const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        /* eslint-enable @typescript-eslint/no-explicit-any */
        const file = e.target.files?.[0];
        const reader = new FileReader();
    
        if(file) {
            field.onChange(file);
            reader.readAsDataURL(file);
            setImg(URL.createObjectURL(file));
        }
    }


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            logo: undefined,
            minDeposit: '',
        },
    })


    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            console.log(values)
        } catch (error) {
          console.error("Error submitting activation code ", error);
        } finally {
          form.reset();
          setImg('');
          setIsLoading(false)
        }
    }

    return (
        <main className='py-5'>
            <div
                className='flex items-center justify-start'
            >
                {AddressType.map(type => {

                    const active = addressType === type.id;

                    return (
                        <Button
                            key={type.id}
                            type='button'
                            className={`rounded-none bg-dark-gradient-135deg hover:bg-light-gradient-135deg
                                ${
                                    active ? 'bg-light-gradient-135deg' : ''
                                }`}
                              onClick={() => setAddressType(type.id)}
                        >
                            {type.description}
                        </Button>
                    )
                })}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                
                <div className="">

                    <FormField
                        control={form.control}
                        name='logo'
                        render={({ field }) => (
                            <div className='relative w-64'>
                                
                                {img ? (
                                    <>
                                        <Image
                                            src={img}
                                            width={100}
                                            height={100}
                                            alt='payment logo template'
                                            className='w-full h-auto cursor-pointer'
                                            onClick={() => imgRef.current?.click()}
                                        />
                                    </>
                                ) : (
                                    <div className='relative'>
                                        <p className='text-gray-400 text-lg font-semibold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>Payment Logo</p>
                                        <Image
                                            src='/image-icon.svg'
                                            width={100}
                                            height={100}
                                            alt='payment logo template'
                                            className='w-full h-auto cursor-pointer'
                                            onClick={() => imgRef.current?.click()}
                                        />
                                    </div>
                                )}

                                <FormControl>
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        className='py-1 w-full text-base text-primary outline-none hidden'
                                        ref={imgRef}
                                        onChange={(e) => {
                                            handleImgUpload(e, field);
                                            field.onChange(e.target.files && e.target.files[0]);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <div className='flex flex-col gap-2 w-full mt-5'>

                                <FormControl>
                                    <Input
                                        id='name'
                                        placeholder='payment method e.g paypal, skrill e.t.c'
                                        type='text'
                                        {...field}
                                        className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md'
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <div className='flex flex-col gap-2 w-full mt-5'>

                                <FormControl>
                                    <Input
                                        id='email'
                                        placeholder={addressType === '1' ? 'enter email address' : 'enter user Id'}
                                        type='text'
                                        {...field}
                                        className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md'
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name='minDeposit'
                        render={({ field }) => (
                            <div className='flex flex-col gap-2 w-full my-5'>

                                <FormControl>
                                    <Input
                                        id='minDeposit'
                                        placeholder='minimum deposit'
                                        type='text'
                                        {...field}
                                        className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md'
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        )}
                    />

                    <Button type='submit' 
                        disabled={isLoading}
                        className='w-full bg-light-gradient-135deg text-lg text-color-30 rounded-full'
                    >
                        {isLoading ? (
                        <>
                            <Loader2 size={20} className='animate-spin'/>&nbsp; 
                            Loading...
                        </>
                        ): 'Upload'}
                    </Button>
                </div>
              </form>
            </Form>
        </main>
    )
}

export default IntlPayment