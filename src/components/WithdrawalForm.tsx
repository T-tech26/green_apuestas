import { BankDetails, PaymentMethods, UserData } from '@/types/globals'
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useUser } from '@/contexts/child_context/userContext';
import { formatAmount, generateDateString, transactionsWithImages } from '@/lib/utils';
import Image from 'next/image';
import AllowVerification from './AllowVerification';
import { toast } from '@/hooks/use-toast';
import { adminNotification, createTransaction, getTransactions } from '@/lib/actions/userActions';
import { useUserSlipContext } from '@/contexts/child_context/userSlipContext';
import { useTransactionContext } from '@/contexts/child_context/transactionContext';
import LiveChat from './LiveChat';


interface WithdrawalFormProps {
    step: number,
    setStep: (newStep: number) => void,
    method: BankDetails
}


const WithdrawalForm = ({ step, setStep, method }: WithdrawalFormProps) => {

    const { user } = useUser();
    const { setTransactions } = useTransactionContext();

    const [isLoading, setIsLoading] = useState(false);
    const [amountExceeded, setAmountExceeded] = useState(false);
    const [checkBilling, setCheckBilling] = useState(false);
    const [wireTransferMessage, setWireTransferMessage] = useState(false);


    const formSchema = z.object({
        amount: z.string().min(3),
    });


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: ''
        },
    });



    const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredAmount = e.target.value;

        const check = Number(enteredAmount) > Number((user as UserData).balance);

        if(check) { setAmountExceeded(true); } else { setAmountExceeded(false); }

        form.setValue('amount', enteredAmount);
    }


    // 2. Define a submit handler.
    const onSubmit = async () => {

        const transactionTime = generateDateString();
        const userId = (user as UserData).userId;
        const amount = form.getValues('amount');

        setIsLoading(true)
        try {

            if(!(user as UserData).chargesPaid) { setCheckBilling(true); return; }


            const response = await createTransaction('', amount, (method as PaymentMethods), transactionTime, userId, 'Withdrawal');


            if(response !== 'success') {
                toast({
                    description: 'Something went wrong! try again'
                })
                return;
            } else {
                toast({
                    description: "Your withdrawal is pending"
                })
            }


            await adminNotification(userId, 'withdrawal', transactionTime, amount);

            const res = await getTransactions();
            if(typeof res === 'string') return;
            const trans = transactionsWithImages(res);
            setTransactions(trans);


            if((user as UserData).chargesPaid && (user as UserData).premiumCard) {
                setWireTransferMessage(true);
                
                setTimeout(() => {
                    setWireTransferMessage(false);
                }, 15000);
            }

        } catch (error) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            toast({
                description: `${(error as any)?.message}, try again`
            });
            /* eslint-enable @typescript-eslint/no-explicit-any */
            console.error("Error uploading bank details ", error);
        } finally {
            setIsLoading(false)
            form.reset();
        }
    }


    const amount = form.watch('amount');


    return (
        <main className='flex-1 py-14 overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-10'>
                <div className='bg-dark-gradient-135deg rounded-md p-5 flex flex-col gap-3'>
                <p className='flex items-center justify-between border border-color-10 rounded-md px-4 py-2 text-color-30 text-sm'>
                    <span className='font-semibold tracking-wide'>Bank name</span> <span translate='no'>{method.bankName}</span>
                </p>
                <p className='flex items-center justify-between border border-color-10 rounded-md px-4 py-2 text-color-30 text-sm'>
                    <span className='font-semibold tracking-wide'>Account name</span> <span translate='no'>{method.accountName}</span>
                </p>
                <p className='flex items-center justify-between border border-color-10 rounded-md px-4 py-2 text-color-30 text-sm'>
                    <span className='font-semibold tracking-wide'>Account number</span> <span translate='no'>{method.accountNumber}</span>
                </p>
                <p className='flex items-center justify-between border border-color-10 rounded-md px-4 py-2 text-color-30 text-sm'>
                    <span className='font-semibold tracking-wide'>Account currency</span> <span translate='no'>{method.currency}</span>
                </p>
                </div>


                <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        
                        <div className="flex flex-col gap-4">

                            <p className='flex items-center justify-between text-gray-400 text-sm px-4'>Minimum withdrawal <span translate='no'>100 USD</span></p>
                            <p className='flex items-center justify-between text-gray-400 text-sm px-4'>
                                <span className='flex-1'>Available withdrawable amount</span> <span translate='no'>{formatAmount((user as UserData).balance.toString())} USD</span>
                            </p>

                            <FormField
                                control={form.control}
                                name='amount'
                                render={() => (
                                    <div className='flex flex-col gap-2 w-full mt-5'>

                                        <FormControl>
                                        <div className='flex flex-col gap-2'>
                                            <Input
                                                id='amount'
                                                placeholder='enter amount'
                                                type='text'
                                                {...form.register('amount')}
                                                value={amount}
                                                className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md text-sm'
                                                onChange={handleAmount}
                                            />

                                            {amountExceeded && <p className='text-xs text-red-300'>Amount entered exceeds the withdrawable amount</p>}
                                        </div>
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />

                            <div className='flex items-center gap-4'>
                            <Button type='button' 
                                className='w-full bg-light-gradient-135deg text-sm text-color-30 rounded-full'
                                onClick={() => setStep(step - 1)}
                            >
                                Back
                            </Button>

                            <Button type='submit' 
                                disabled={isLoading}
                                className='w-full bg-light-gradient-135deg text-sm text-color-30 rounded-full'
                            >
                                {isLoading ? 'Loading' : 'Request'}
                            </Button>
                            </div>
                        </div>
                    </form>
                </Form>
                </div>
            </div>

            {checkBilling === true && (
                <AllowVerification id={(user as UserData).$id} setCheckBilling={setCheckBilling} />
            )}

            {wireTransferMessage === true && (
                <div className='fixed top-0 bottom-0 left-0 right-0 bg-color-60 bg-opacity-30 flex justify-center items-center'>
                    <div className='w-4/5 md:w-1/2 h-auto px-8 py-10 bg-color-30 rounded-md relative'>
                        <Image 
                            src='/close.svg'
                            width={25}
                            height={25}
                            alt='Close icon'
                            className='absolute top-5 right-5 cursor-pointer'
                            onClick={() => {
                                setWireTransferMessage(false);
                                form.reset();
                            }}
                        />

                        <p className='text-color-60 text-sm'>Amount ${formatAmount(amount)} <span translate='no'>USD</span> requested for withdrawal is too big, please contact the management via support to process withdrawal with the necessary legal documents for a wire transfer.</p>
                    </div>
                </div>
            )}

            <LiveChat />
        </main>
    )
}

export default WithdrawalForm