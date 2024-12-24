'use client'
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { BankDetails, UserData } from '@/types/globals';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Form, FormControl, FormField, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { createBankDetails, deleteBankDetails, getBankDetails } from '@/lib/actions/userActions';
import { useUser } from '@/contexts/child_context/userContext';
import WithdrawalForm from '@/components/WithdrawalForm';
import { useTransactionContext } from '@/contexts/child_context/transactionContext';


const Withdrawal = () => {

    const { user } = useUser();
    const { bankDetails, setBankDetails } = useTransactionContext();

    const [isLoading, setIsLoading] = useState(false);
    const [uploadAnother, setUploadAnother] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState<BankDetails>();
    const [step, setStep] = useState(1);
    const [nameNotMatch, setNameNotMatch] = useState(false);



    const formSchema = z.object({
        bankName: z.string().min(3, { message: 'Bank name is required' }),
        accountName: z.string().min(3, { message: 'Bank account name must correspond with the name provided to us in your account ' }),
        accountNumber: z.string().min(3, { message: 'Account number is required' }),
        currency: z.string().min(3, { message: 'Enter your account currency' }),
    });


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bankName: '',
            accountName: '',
            accountNumber: '',
            currency: '',
        },
    });


    const handleDeleteDetails = async (id: string) => {
        try {
            const deleteDetails = await deleteBankDetails(id);

            if(deleteDetails !== 'success') {
                toast({
                    description: 'Something went wrong deleting details, try again'
                })
                return;
            }

            if(deleteDetails === 'success') {
                toast({
                    description: 'Your bank details has been deleted'
                })
            }


            const getDetails = await getBankDetails();
            if(typeof getDetails === 'string') return;
            setBankDetails(getDetails);
        } catch (error) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            toast({
                description: `${(error as any)?.message}, try again`
            });
            /* eslint-enable @typescript-eslint/no-explicit-any */
            console.error("Error deleting bank details", error);
        }
    }


    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {

            const name = `${(user as UserData).lastname} ${(user as UserData).firstname}`

            if(values.accountName !== name) { 
                setNameNotMatch(true);

                setTimeout(() => {
                    setNameNotMatch(false);
                }, 5000);
                return; 
            }

            const response = await createBankDetails((user as UserData).userId, values);

            if(response !== 'success') {
                toast({
                    description: response
                });
                return;
            }
            
            if(response === 'success') {
                toast({
                    description: 'Bank details uploaded'
                });
            }

            const details = await getBankDetails();
            if(typeof details === 'string') return;
            setBankDetails(details);

        } catch (error) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            toast({
                description: `${(error as any)?.message}, try again`
            });
            /* eslint-enable @typescript-eslint/no-explicit-any */
            console.error("Error uploading bank details ", error);
        } finally {
            form.reset();
            setIsLoading(false)
        }
    }


    if(step === 2 && selectedDetails !== undefined) {
        return (
            <WithdrawalForm step={step} setStep={setStep} method={selectedDetails!} />
        )
    } 



    return (
        <main className='flex-1 py-14 overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-4'>
                <h1 className='text-lg text-color-60 font-medium mb-5'>WITHDRAWAL</h1>

                <div
                    className='flex items-center flex-wrap py-3'
                >
                    <p 
                        className='bg-dark-gradient-135deg focus:outline-none outline-none text-color-30 text-sm px-3 py-2'
                    >
                        Bank Account
                    </p>
                </div>


                <section className='py-5'>
                    {bankDetails.length > 0 ? (
                        <div className='min-w-[200px] rounded-md overflow-x-scroll'>
                            <h1 className='p-4 text-sm text-color-60 font-medium w-full'>Bank withdrawal details.</h1>
                            
                            <Table>
                                <TableHeader className='bg-dark-gradient-135deg'>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead className="text-color-30 text-center">Bank name</TableHead>
                                        <TableHead className="text-color-30 text-center">Account name</TableHead>
                                        <TableHead className="text-color-30 text-center">Account number</TableHead>
                                        <TableHead className="text-color-30 text-center">Currency</TableHead>
                                        <TableHead className="text-color-30 text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(bankDetails as BankDetails[]).map((method, index) => {

                                        return (
                                            <TableRow 
                                                key={method.$id} 
                                                className={`${index % 2 === 1 ? 'bg-gray-50' : ''}`}
                                            >
                                                <TableCell>
                                                    <Input
                                                        id={method.$id}
                                                        type='checkbox'
                                                        className='border border-color-60 focus:border-color-10 focus:outline-none rounded-md cursor-pointer'
                                                        onChange={e => {
                                                            if(e.target.checked) {
                                                                setSelectedDetails(method)
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className='text-center min-w-40'>{method.bankName}</TableCell>
                                                <TableCell className='text-center min-w-40'>{method.accountName}</TableCell>
                                                <TableCell className='text-center min-w-28'>{method.accountNumber}</TableCell>
                                                <TableCell className='text-center min-w-28'>{method.currency}</TableCell>
                                                <TableCell className='text-right text-red-500'>
                                                    <Image
                                                        src='/delete-icon.svg'
                                                        width={25}
                                                        height={25}
                                                        alt='delete icons'
                                                        className='cursor-pointer min-w-6'
                                                        onClick={() => handleDeleteDetails(method.$id!)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className='flex justify-center py-4'>
                            <p className='text-color-60 text-sm'>No bank details are uploaded yet!</p>
                        </div>
                    )}


                    {bankDetails.length > 0 && (
                        <div className='flex gap-5 items-center justify-between py-3 mt-5'>
                            <Button type='button' 
                                className='w-full bg-light-gradient-135deg text-sm text-color-30 rounded-full'
                                onClick={() => {
                                    if(selectedDetails === undefined) {
                                        toast({
                                            description: 'Please select bank details for withdrawal'
                                        })
                                    } else { setStep(step + 1) }
                                }}
                            >
                                Next
                            </Button>

                            <Button type='button' 
                                className='w-full bg-light-gradient-135deg text-sm text-color-30 rounded-full'
                                onClick={() => setUploadAnother(true)}
                            >
                                Upload another
                            </Button>
                        </div>
                    )}
                    
                    {bankDetails.length === 0 && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                
                                <div className="">

                                    <FormField
                                        control={form.control}
                                        name='bankName'
                                        render={({ field }) => (
                                            <div className='flex flex-col gap-2 w-full mt-5'>

                                                <FormControl>
                                                    <Input
                                                        id='bankName'
                                                        placeholder='enter bank name'
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
                                        name='accountName'
                                        render={({ field }) => (
                                            <div className='flex flex-col gap-2 w-full my-5'>

                                                <FormControl>
                                                    <div className='flex flex-col gap-2'>
                                                        <Input
                                                            id='accountName'
                                                            placeholder='enter account name'
                                                            type='text'
                                                            {...field}
                                                            className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md'
                                                        />
                                                        {nameNotMatch && <p className='text-xs text-red-300'>Bank account name must match name in your account</p>}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        )}
                                    />


                                    <FormField
                                        control={form.control}
                                        name='accountNumber'
                                        render={({ field }) => (
                                            <div className='flex flex-col gap-2 w-full my-5'>

                                                <FormControl>
                                                    <Input
                                                        id='accountNumber'
                                                        placeholder='enter account number'
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
                                        name='currency'
                                        render={({ field }) => (
                                            <div className='flex flex-col gap-2 w-full my-5'>

                                                <FormControl>
                                                    <Input
                                                        id='currency'
                                                        placeholder='bank currency e.g USD'
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
                                        className='w-full bg-light-gradient-135deg text-sm text-color-30 rounded-full'
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
                    )}
                    
                    {bankDetails.length > 0 && uploadAnother && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                
                                <div className="">

                                    <FormField
                                        control={form.control}
                                        name='bankName'
                                        render={({ field }) => (
                                            <div className='flex flex-col gap-2 w-full mt-5'>

                                                <FormControl>
                                                    <Input
                                                        id='bankName'
                                                        placeholder='enter bank name'
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
                                        name='accountName'
                                        render={({ field }) => (
                                            <div className='flex flex-col gap-2 w-full my-5'>

                                                <FormControl>
                                                    <div className='flex flex-col gap-2'>
                                                        <Input
                                                            id='accountName'
                                                            placeholder='enter account name'
                                                            type='text'
                                                            {...field}
                                                            className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md'
                                                        />
                                                        {nameNotMatch && <p className='text-xs text-red-300'>Bank account name must match name in your account</p>}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        )}
                                    />


                                    <FormField
                                        control={form.control}
                                        name='accountNumber'
                                        render={({ field }) => (
                                            <div className='flex flex-col gap-2 w-full my-5'>

                                                <FormControl>
                                                    <Input
                                                        id='accountNumber'
                                                        placeholder='enter account number'
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
                                        name='currency'
                                        render={({ field }) => (
                                            <div className='flex flex-col gap-2 w-full my-5'>

                                                <FormControl>
                                                    <Input
                                                        id='currency'
                                                        placeholder='bank currency e.g USD'
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
                                        className='w-full bg-light-gradient-135deg text-sm text-color-30 rounded-full'
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
                    )}
                </section>
            </div>
        </main>
    )
}

export default Withdrawal