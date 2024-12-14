import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormMessage } from './ui/form';
import Image from 'next/image';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { PaymentMethods } from '@/types/globals';
import { useOtherContext } from '@/contexts/child_context/otherContext';
import { createPaymentMethod, deletePaymentMethod, getPaymentMethods } from '@/lib/actions/userActions';
import { toast } from '@/hooks/use-toast';
import { paymentMethodsWithImages } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const BankPayment = () => {

    const imgRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [img, setImg] = useState('');
    const [type, setType] = useState<PaymentMethods[] | string>('');
    const [deleteMethod, setDeleteMethod] = useState<string | PaymentMethods>('');

    const { paymentMethods, setPaymentMethods } = useOtherContext();


    useEffect(() => {
        if(paymentMethods.length > 0) {
            const cryptoType = paymentMethods.filter(methods => {  return methods.bankName; });
            setType(cryptoType);
        }
    }, [paymentMethods]);


    const deletePayment = async () => {
        try {
            if(deleteMethod) {
                const response = await deletePaymentMethod(deleteMethod);
                if(response !== 'Success') {
                    toast({
                        description: 'Error deleting payment method try again'
                    })
                    return
                }
                const res = await getPaymentMethods();
                if(typeof res === 'string') return;
                const payments = paymentMethodsWithImages(res);
                setPaymentMethods(payments);
            }
        } catch (error) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            toast({
                description: `${(error as any)?.message}, try again`
            });
            /* eslint-enable @typescript-eslint/no-explicit-any */
            console.error("Error deleting payment method ", error);
        }
    }


    const formSchema = z.object({
        logo: z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'File size must be less than or equal to 5MB',
            })
            .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
            message: 'File must be PNG or JPEG',
            }),
        type: z.string().min(3),
        bankName: z.string().min(3),
        accountName: z.string().min(3),
        accountNumber: z.string().min(3),
        minDeposit: z.string().min(3),
        currency: z.string().min(3),
        rate: z.string().min(3),
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
            logo: undefined,
            type: '',
            bankName: '',
            accountName: '',
            accountNumber: '',
            minDeposit: '',
            currency: '',
            rate: ''
        },
    })


    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            const res = await createPaymentMethod(values);

            if(res) {
                toast({
                    description: res
                });
            } else {
                toast({
                    description: 'Payment method uploaded'
                });
            }

            const response = await getPaymentMethods();
            if(typeof response === 'string') return;
            const payments = paymentMethodsWithImages(response);
            setPaymentMethods(payments);

        } catch (error) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            toast({
                description: `${(error as any)?.message}, try again`
            });
            /* eslint-enable @typescript-eslint/no-explicit-any */
            console.error("Error uploading payment method ", error);
        } finally {
          form.reset();
          setImg('');
          setIsLoading(false)
        }
    }


    return (
        <main className='py-5'>

            {Array.isArray(type) && type.length > 0 ? (
                <div className='min-w-[200px] rounded-md overflow-x-scroll'>
                    <h1 className='p-4 text-sm text-color-60 font-medium w-full'>Crypto payment methods.</h1>
                    <Table>
                        <TableHeader className='bg-dark-gradient-135deg'>
                            <TableRow>
                                <TableHead className="text-color-30 text-center">Type</TableHead>
                                <TableHead className="text-color-30 text-center">Bank name</TableHead>
                                <TableHead className="text-color-30 text-center">Account name</TableHead>
                                <TableHead className="text-color-30 text-center">Account number</TableHead>
                                <TableHead className="text-color-30 text-center">Currency</TableHead>
                                <TableHead className="text-color-30 text-center">Rate</TableHead>
                                <TableHead className="text-color-30 text-center">Minimum deposit</TableHead>
                                <TableHead className="text-color-30 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {type.map((method, index) => {

                                const logo = method.logoUrl;

                                return (
                                    <TableRow 
                                        key={method.$id} 
                                        className={`hover:bg-light-gradient-135deg cursor-pointer ${index % 2 === 1 ? 'bg-gray-50' : ''}`}
                                    >
                                        <TableCell className="font-medium flex gap-2 justify-center items-center min-w-40">
                                            {/* eslint-disable @next/next/no-img-element */}
                                            <img
                                                src={logo ? logo : '/profile-icon.svg'}
                                                width={40}
                                                height={40}
                                                alt='method logo'
                                                className='rounded-full size-9'
                                            />
                                            {/* eslint-enable @next/next/no-img-element */}
                                            {`${method.type}`}
                                        </TableCell>
                                        <TableCell className='text-center min-w-40'>{method.bankName}</TableCell>
                                        <TableCell className='text-center min-w-40'>{method.accountName}</TableCell>
                                        <TableCell className='text-center min-w-28'>{method.accountNumber}</TableCell>
                                        <TableCell className='text-center min-w-28'>{method.currency}</TableCell>
                                        <TableCell className='text-center min-w-40'>
                                            <p className='text-gray-400 font-semibold text-sm flex items-center gap-1'>
                                                <span className='text-nowrap'>1 USD</span>
                                                <Image
                                                    src='/rate-icon.svg'
                                                    width={10}
                                                    height={10}
                                                    alt='rate icon'
                                                />
                                                {method.rate} {method.currency}
                                            </p>
                                        </TableCell>
                                        <TableCell className='text-center min-w-28'>{method.minDeposit}</TableCell>
                                        <TableCell className='text-right text-red-500'>
                                            <Image
                                                src='/delete-icon.svg'
                                                width={25}
                                                height={25}
                                                alt='delete icons'
                                                className='cursor-pointer min-w-6'
                                                onClick={() => {
                                                    setDeleteMethod(method);
                                                    deletePayment();
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            ) : Array.isArray(type) && type.length === 0 ? (
                <div className='flex justify-center py-4'>
                    <p className='text-color-60 text-sm'>No crypto method of payment is uploaded yet!</p>
                </div>
            ) : (
                <div className="w-full h-52 bg-gray-300 animate-pulse flex items-center justify-between rounded-md">
                </div>
            )}


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
                                        <p className='text-gray-400 text-lg font-semibold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>Bank Logo</p>
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
                        name='type'
                        render={({ field }) => (
                            <div className='flex flex-col gap-2 w-full mt-5'>

                                <FormControl>
                                    <Input
                                        id='type'
                                        placeholder='Payment method e.g Bank Transfer'
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
                                    <Input
                                        id='accountName'
                                        placeholder='enter account name'
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

                    <FormField
                        control={form.control}
                        name='currency'
                        render={({ field }) => (
                            <div className='flex flex-col gap-2 w-full my-5'>

                                <FormControl>
                                    <Input
                                        id='currency'
                                        placeholder='bank currency'
                                        type='text'
                                        {...field}
                                        className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md'
                                    />
                                </FormControl>
                                <FormMessage />
                            </div>
                        )}
                    />

                    <div className='flex items-center justify-between gap-3'>
                        <p className='text-gray-400 font-semibold text-sm flex justify-between items-center py-[10px] px-3 border border-color-60 rounded-md w-full'>
                            <span>USD</span>
                            <span>1</span>
                        </p>
                        <p className='text-gray-400 font-semibold text-sm'>
                            <Image
                                src='/rate-icon.svg'
                                width={50}
                                height={50}
                                alt='rate icon'
                            />
                        </p>
                        <FormField
                            control={form.control}
                            name='rate'
                            render={({ field }) => (
                                <div className='flex flex-col gap-2 w-full my-5'>

                                    <FormControl>
                                        <Input
                                            id='rate'
                                            placeholder='dollar rate in bank currency'
                                            type='text'
                                            {...field}
                                            className='w-full text-color-60 py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
                        />
                    </div>

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

export default BankPayment