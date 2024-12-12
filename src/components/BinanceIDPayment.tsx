'use client'
import { toast } from '@/hooks/use-toast';
import { PaymentMethods, UserData } from '@/types/globals';
import Image from 'next/image';
import React, { useRef, useState } from 'react'
import { Button } from './ui/button';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { createTransaction } from '@/lib/actions/userActions';
import { useUser } from '@/contexts/child_context/userContext';
import { Loader2 } from 'lucide-react';



interface MethodProps {
    methodType: PaymentMethods;
    setMethod: (newMethod: PaymentMethods | string) => void;
}

const BinanceIDPayment = ({ methodType, setMethod }: MethodProps) => {

    const imgRef = useRef<HTMLInputElement | null>(null);
    const [step, setStep] = useState<number>(1);
    const [img, setImg] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useUser();


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


    const formSchema = z.object({
        amount: z.string().min(2, {message: 'Amount must be greater than minimum deposit'}),
        reciept: z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'File size must be less than or equal to 5MB',
            })
            .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
            message: 'File must be PNG or JPEG',
            }),
    })


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          amount: '',
          reciept: undefined
        },
    })


    const handleNextStep = () => {

        const firstForm: ('amount') = 'amount';
        const secondForm: ('reciept') = 'reciept'

        if (step === 1) {
            setStep(step + 1);
        } else if(step === 2) {
            form.trigger(firstForm).then((isValid) => {
                if (isValid) {
                    const amount = form.getValues('amount');

                    if(parseFloat(amount) >= Number(methodType.minDeposit)) {
                        setStep(step + 1); // Proceed to next step if validation passes
                    } else {
                        // Invalidate the amount input if threshold is not met
                        form.setError('amount', {
                            type: 'manual', // Indicate this is a custom error
                            message: `Minimum deposit is ${methodType.minDeposit} USD`, // Custom error message
                        });
                    }
                }
            });
        } else if(step === 3) {
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


    const handleCopyClick = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
    
            toast({
                description: 'Copied successfully',
            });
        } catch (error) {
            console.error("Failed to copy text:", error);
            toast({
                description: 'Failed to copy text',
            });
        }
    };


    const generateDateString = () => {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0'); // Adds leading zero for single-digit days
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so we add 1
        const year = today.getFullYear();
    
        return `${day}/${month}/${year}`;
    }


    const onSubmit = async (data: z.infer<typeof formSchema>) => {

        const transactionTime = generateDateString();
        const userId = (user as UserData).userId;

        if(step === 3) {
            setLoading(true);
            try {
                const response = await createTransaction(data, methodType, transactionTime, userId);
        
                if(response !== 'Success') {
                toast({
                    description: response
                })
                } else {
                    
                }

                /* eslint-disable @typescript-eslint/no-explicit-any */
            } catch (error: any) {
                /* eslint-enable @typescript-eslint/no-explicit-any */
                console.error("Registration error", error);
            } finally {
                setLoading(false);
                form.reset();
                toast({
                    description: "Your deposit is pending"
                })
                setMethod('')
            }
        }
    };
    

    return (
        <main className='relative'>
            <Image 
                src='/close.svg'
                width={25}
                height={25}
                alt='Close icon'
                className='absolute -top-[30px] -right-[10px]'
                onClick={() => setMethod('')}
            />
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                
                    <div 
                        className="flex flex-col justify-center item-center gap-2"
                    >
                        {step === 1 && (
                            <div className='flex flex-col justify-center gap-5'>
                                <div className='flex items-center gap-2 text-sm text-color-60'>
                                    <img
                                        src={methodType ? methodType.logoUrl : '/profile-icon.svg'}
                                        width={30}
                                        height={30}
                                        alt='method logo'
                                        className='rounded-full size-9'
                                    />
                                    {`${methodType.type}`}
                                </div>

                                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                                    <p className='font-semibold text-base text-color-60'>Pay ID</p>
                                    <p 
                                        className='text-sm text-color-60 flex items-center gap-3'
                                        onClick={() => handleCopyClick(methodType.payId ? methodType.payId : '')}
                                    >
                                        <Image
                                            src='/copy-content-icon.svg'
                                            width={15}
                                            height={15}
                                            alt='menu icons'
                                            className='cursor-pointer'
                                            onClick={() => handleCopyClick(methodType.payId ? methodType.payId : '')}
                                        />
                                        {methodType.payId}
                                    </p>
                                </div>

                                <div className='flex items-center justify-between w-full border border-color-60 rounded-md py-1 px-2'>
                                    <p className='font-semibold text-base text-color-60'>Minimum deposite</p>
                                    <p className='text-sm text-color-60'>{methodType.minDeposit}</p>
                                </div>

                                <Button
                                    type='button'
                                    className='bg-dark-gradient-135deg'
                                    onClick={() => handleNextStep()}
                                >
                                    Next
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <>
                                <FormField
                                    control={form.control}
                                    name='amount'
                                    render={({ field }) => (
                                        <div className='flex flex-col gap-2 w-full'>
                                            <FormControl>
                                                <Input
                                                    id='amount'
                                                    placeholder='enter amount'
                                                    type='text'
                                                    {...field}
                                                    className='px-4 py-2 rounded-md bg-transparent border border-color-60 text-color-60 placeholder:text-color-60 focus:outline-none'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    )}
                                />

                                <div className='flex items-center gap-3 w-full mt-3'>
                                    <Button
                                        type='button'
                                        className='bg-dark-gradient-135deg w-full'
                                        onClick={() => handlePrevStep()}
                                    >
                                        Back
                                    </Button>

                                    <Button
                                        type='button'
                                        className='bg-dark-gradient-135deg w-full'
                                        onClick={() => handleNextStep()}
                                    >
                                        Paid
                                    </Button>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                {img ? (
                                    <>
                                        <div className='flex justify-center items-center'>
                                            <Image
                                                src={img}
                                                width={150}
                                                height={150}
                                                alt='reciept'
                                                className='cursor-pointer'
                                                onClick={() => imgRef.current?.click()}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className='flex flex-col items-center justify-center'>
                                        <p className='text-white text-sm font-semibold'>Payment reciept</p>
                                        <Image
                                            src='/image-icon.svg'
                                            width={150}
                                            height={150}
                                            alt='reciept template'
                                            className='cursor-pointer'
                                            onClick={() => imgRef.current?.click()}
                                        />
                                    </div>
                                )}

                                <FormField
                                    control={form.control}
                                    name='reciept'
                                    render={({ field }) => (
                                        <div className='flex flex-col gap-2 w-full'>
                                            <FormControl>
                                                <Input
                                                    id="reciept"
                                                    type="file"
                                                    accept="image/png, image/jpeg"
                                                    className='py-1 w-full text-base text-primary outline-none'
                                                    placeholder='Payment reciept'
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

                                <Button
                                    type='submit'
                                    disabled={loading}
                                    className='bg-dark-gradient-135deg w-full'
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className='animate-spin'/> &nbsp; 
                                            Loading...
                                        </>
                                    ): 'Submit'}
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </FormProvider>
        </main>
    )
}

export default BinanceIDPayment