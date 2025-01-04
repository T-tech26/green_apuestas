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
import { adminNotification, createTransaction, getTransactions } from '@/lib/actions/userActions';
import { useUser } from '@/contexts/child_context/userContext';
import { Loader2 } from 'lucide-react';
import { formatAmount, paymentFormSchema, transactionsWithImages } from '@/lib/utils';
import PaymentDetails from './PaymentDetails';
import { useTransactionContext } from '@/contexts/child_context/transactionContext';



interface MethodProps {
    methodType: PaymentMethods;
    setMethod: (newMethod: PaymentMethods | string) => void;
}

const PaymentForm = ({ methodType, setMethod }: MethodProps) => {

    const imgRef = useRef<HTMLInputElement | null>(null);
    const [step, setStep] = useState<number>(1);
    const [img, setImg] = useState('');
    const [loading, setLoading] = useState(false);
    const [equivalentAmountInCurrency, setEquivalentAmountInCurrency] = useState<number | string>(0);

    const { user } = useUser();
    const { setTransactions } = useTransactionContext();


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
    const form = useForm<z.infer<typeof paymentFormSchema>>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
          amount: '',
          reciept: undefined
        },
    })


    const formatRate = (minDeposit: number, rate: number): string => {
        const calculatedAmount = minDeposit * rate;

        const formatedAmount = formatAmount(calculatedAmount.toString());

        return formatedAmount;
    }


    const handleRateConversion = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredAmount = e.target.value;

        const localAmount = Number(enteredAmount) * Number(methodType.rate);

        setEquivalentAmountInCurrency(formatAmount(localAmount.toString()));

        form.setValue('amount', enteredAmount);
    }


    const handleNextStep = () => {

        const firstForm = 'amount';
        const secondForm = 'reciept'

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


    const generateDateString = () => {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0'); // Adds leading zero for single-digit days
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so we add 1
        const year = today.getFullYear();
        const hour = today.getHours().toString().padStart(2, '0');
        const minutes = today.getMinutes().toString().padStart(2, '0');
        const seconds = today.getSeconds().toString().padStart(2, '0');
    
        return `${day}-${month}-${year}, ${hour}:${minutes}:${seconds}`;
    }


    const onSubmit = async (data: z.infer<typeof paymentFormSchema>) => {

        const transactionTime = generateDateString();
        const userId = (user as UserData).userId;

        if(step === 3) {
            setLoading(true);
            try {
                const response = await createTransaction(data.reciept, data.amount, methodType, transactionTime, userId, 'Deposit');
        
                if(response !== 'success') {
                    toast({
                        description: 'Something went wrong! try again'
                    })
                    return;
                } else {
                    toast({
                        description: "Your deposit is pending"
                    })
                }

                await adminNotification(userId, 'deposit', transactionTime, data.amount)

                const res = await getTransactions();
                if(typeof res === 'string') return;
                const trans = transactionsWithImages(res);
                setTransactions(trans);
                /* eslint-disable @typescript-eslint/no-explicit-any */
            } catch (error: any) {
                /* eslint-enable @typescript-eslint/no-explicit-any */
                console.error("Registration error", error);
            } finally {
                setLoading(false);
                setImg('');
                form.reset();
                setStep(1);
                setMethod('');
            }
        }
    };


    const amount = form.watch('amount');
    

    return (
        <main className='relative'>
            <Image 
                src='/close.svg'
                width={25}
                height={25}
                alt='Close icon'
                className='absolute -top-[30px] -right-[10px]'
                onClick={() => {
                    form.setValue('amount', '');
                    setImg('');
                    setLoading(false);
                    setStep(1);
                    setMethod('');
                }}
            />
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                
                    <div 
                        className="flex flex-col justify-center item-center gap-2"
                    >
                        {step === 1 && (
                            <PaymentDetails methodType={methodType} step={step} setStep={setStep} />
                        )}

                        {step === 2 && (
                            <>
                                <FormField
                                    control={form.control}
                                    name='amount'
                                    render={({ field }) => (
                                        <div className='flex flex-col gap-2 w-full'>
                                            <FormControl>
                                                {methodType.bankName ? (
                                                    <div
                                                        className='pr-4 pb-2 rounded-md border border-color-60 flex flex-col md:flex-row md:pb-0 gap-2 md:items-center justify-between'
                                                    >
                                                        <Input
                                                            id='amount'
                                                            placeholder='enter amount'
                                                            type='text'
                                                            {...form.register('amount')}
                                                            value={amount}
                                                            className='px-4 py-2 rounded-md bg-transparent text-color-60 placeholder:text-color-60 focus:outline-none flex-1'
                                                            onChange={handleRateConversion}
                                                        />

                                                        <p className='text-[13px] pl-4'>
                                                            Minimum deposit {equivalentAmountInCurrency === 0 ? formatRate(Number(methodType.minDeposit), Number(methodType.rate)) : equivalentAmountInCurrency} {methodType.currency}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <Input
                                                        id='amount'
                                                        placeholder='enter amount'
                                                        type='text'
                                                        {...field}
                                                        className='px-4 py-2 rounded-md bg-transparent border border-color-60 text-color-60 placeholder:text-color-60 focus:outline-none'
                                                    />
                                                )}
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

export default PaymentForm