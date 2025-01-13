import React, { useRef, useState } from 'react'
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormMessage } from './ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { UserData } from '@/types/globals';
import { adminNotification, getVerificationDocuments, uploadDocument } from '@/lib/actions/userActions';
import { generateDateString, verificationDocumentWithImages } from '@/lib/utils';
import { useUser } from '@/contexts/child_context/userContext';
import Image from 'next/image';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useUserSlipContext } from '@/contexts/child_context/userSlipContext';



interface DocumentVerificationFormProps {
    type: string,
}


const DocumentVerificationForm = ({ type }: DocumentVerificationFormProps) => {


    const { user } = useUser();
    const { setVerificaitonDocuments } = useUserSlipContext();

    const frontImgRef = useRef<HTMLInputElement | null>(null);
    const backImgRef = useRef<HTMLInputElement | null>(null);
    
    const [documentType, setDocumentType] = useState('');
    const [frontImg, setFrontImg] = useState('');
    const [backImg, setBackImg] = useState('');
    const [isLoading, setIsLoading] = useState(false);



    const formSchema = z.object({
        front: z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'File size must be less than or equal to 5MB',
            })
            .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
            message: 'File must be PNG or JPEG',
            }),
        back: z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'File size must be less than or equal to 5MB',
            })
            .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
            message: 'File must be PNG or JPEG',
            }),
    });



    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            front: undefined,
            back: undefined,
        },
    });



    /* eslint-disable @typescript-eslint/no-explicit-any */
    const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>, field: any, name: string) => {
        /* eslint-enable @typescript-eslint/no-explicit-any */
        const file = e.target.files?.[0];
        const reader = new FileReader();

        if(name === 'front' && file) {
            field.onChange(file);
            reader.readAsDataURL(file);
            setFrontImg(URL.createObjectURL(file));
        }
        
        if(name === 'back' && file) {
            field.onChange(file);
            reader.readAsDataURL(file);
            setBackImg(URL.createObjectURL(file));
        }
    }



    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const date = generateDateString();
        setIsLoading(true)
        try {
            if(documentType === '') {
                toast({
                    description: 'Please select the document type to upload'
                });
                return;
            }

            const data = {
                type: documentType,
                front: values.front,
                back: values.back,
                userId: (user as UserData).userId
            }

            const documentUpload = await uploadDocument(data);

            if(documentUpload !== 'success') {
                toast({
                    description: documentUpload
                });
                return;
            } else {
                toast({
                    description: 'Documents uploaded'
                });

                await adminNotification((user as UserData).userId, documentType, date, '');
            }

            const files = await getVerificationDocuments();
            if(typeof files === 'string') return;
            const filesWithImage = verificationDocumentWithImages(files);
            setVerificaitonDocuments(filesWithImage);

        } catch (error) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            toast({
                description: `${(error as any)?.message}, try again`
            });
            /* eslint-enable @typescript-eslint/no-explicit-any */
            console.error("Error uploading documents try again", error);
        } finally {
          form.reset();
          setFrontImg('');
          setBackImg('');
          setIsLoading(false)
        }
    }
    


    return (
        <div>
                {type === 'ID' && (
                    <ul className='text-color-60 text-sm'>
                        <li className='flex items-center gap-2'>
                            <Input 
                                id='National ID' 
                                type='checkbox' 
                                value='National ID'
                                className='cursor-pointer'
                                onChange={e => {
                                    if(e.target.checked) { setDocumentType(e.target.value); }
                                }}
                            />
                            National ID
                        </li>
                        <li className='flex items-center gap-2'>
                            <Input 
                                id='Driving licence' 
                                type='checkbox' 
                                value='Driving licence'
                                className='cursor-pointer'
                                onChange={e => {
                                    if(e.target.checked) { setDocumentType(e.target.value); }
                                }}
                            />
                            Driving licence
                        </li>
                    </ul>
                )}

                
                {type === 'address' && (
                    <ul className='text-color-60 text-sm'>
                        <li className='flex items-center gap-2'>
                            <Input 
                                id='Utility bill' 
                                type='checkbox' 
                                value='Utility bill'
                                className='cursor-pointer'
                                onChange={e => {
                                    if(e.target.checked) { setDocumentType(e.target.value); }
                                }}
                            />
                            Utility bill
                        </li>
                        <li className='flex items-center gap-2'>
                            <Input 
                                id='Bank statement' 
                                type='checkbox' 
                                value='Bank statement'
                                className='cursor-pointer'
                                onChange={e => {
                                    if(e.target.checked) { setDocumentType(e.target.value); }
                                }}
                            />
                            Bank statement
                        </li>
                        <li className='flex items-center gap-2'>
                            <Input 
                                id='Card statement' 
                                type='checkbox' 
                                value='Card statement'
                                className='cursor-pointer'
                                onChange={e => {
                                    if(e.target.checked) { setDocumentType(e.target.value); }
                                }}
                            />
                            Card statement
                        </li>
                        <li className='flex items-center gap-2'>
                            <Input 
                                id='Resident permit' 
                                type='checkbox' 
                                value='Resident permit'
                                className='cursor-pointer'
                                onChange={e => {
                                    if(e.target.checked) { setDocumentType(e.target.value); }
                                }}
                            />
                            Resident permit
                        </li>
                    </ul>
                )}

            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    
                    <div className='flex flex-col gap-10 mt-10'>

                        <FormField
                            control={form.control}
                            name='front'
                            render={({ field }) => (
                                <div className='relative w-full'>
                                    
                                    {frontImg ? (
                                        <>
                                            <Image
                                                src={frontImg}
                                                width={100}
                                                height={100}
                                                alt='payment logo template'
                                                className='w-full h-auto cursor-pointer'
                                                onClick={() => frontImgRef.current?.click()}
                                            />
                                        </>
                                    ) : (
                                        <div className='relative'>
                                            <div 
                                                className='bg-gray-200 w-full h-80 rounded-[30px] p-5'
                                                onClick={() => frontImgRef.current?.click()}
                                            >
                                                <p className='text-gray-400 text-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>Front</p>
                                                <Image
                                                    src='/banner-icon.svg'
                                                    width={300}
                                                    height={300}
                                                    alt='payment logo template'
                                                    className='cursor-pointer mx-auto'
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <FormControl>
                                        <Input
                                            id="front"
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            className='py-1 w-full text-base text-primary outline-none hidden'
                                            ref={frontImgRef}
                                            onChange={(e) => {
                                                handleImgUpload(e, field, 'front');
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
                            name='back'
                            render={({ field }) => (
                                <div className='relative w-full'>
                                    
                                    {backImg ? (
                                        <>
                                            <Image
                                                src={backImg}
                                                width={100}
                                                height={100}
                                                alt='payment logo template'
                                                className='w-full h-auto cursor-pointer'
                                                onClick={() => backImgRef.current?.click()}
                                            />
                                        </>
                                    ) : (
                                        <div className='relative'>
                                            <div 
                                                className='bg-gray-200 w-full h-80 rounded-[30px] p-5'
                                                onClick={() => backImgRef.current?.click()}
                                            >
                                                <p className='text-gray-400 text-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>Back</p>
                                                <Image
                                                    src='/banner-icon.svg'
                                                    width={300}
                                                    height={300}
                                                    alt='payment logo template'
                                                    className='cursor-pointer mx-auto'
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <FormControl>
                                        <Input
                                            id="back"
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            className='py-1 w-full text-base text-primary outline-none hidden'
                                            ref={backImgRef}
                                            onChange={(e) => {
                                                handleImgUpload(e, field, 'back');
                                                field.onChange(e.target.files && e.target.files[0]);
                                            }}
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
        </div>
    )
}

export default DocumentVerificationForm