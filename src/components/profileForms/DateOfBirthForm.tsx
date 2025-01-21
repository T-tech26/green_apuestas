import { UserData } from '@/types/globals'
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { toast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/lib/actions/userActions';
import { dateOfBirthSchema } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useUser } from '@/contexts/child_context/userContext';

interface DateOfBirthProps {
    user: UserData | string,
}

const DateOfBirthForm = ({ user }: DateOfBirthProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [edit, setEdit] = useState(true);

    const { loginUser } = useUser();


    const userData = {
        dateOfBirth: (user as UserData)?.dateOfBirth,
    }


    // 1. Define your form.
    const form = useForm<z.infer<typeof dateOfBirthSchema>>({
        resolver: zodResolver(dateOfBirthSchema),
        defaultValues: {
          dateOfBirth: userData.dateOfBirth,
        },
    })
  
  
  
    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof dateOfBirthSchema>) => {
        
        setIsLoading(true)
        try {

            const { dateOfBirth } = values;

            const id = (user as UserData)?.$id;

            const response = await updateUserProfile('dateOfBirth', dateOfBirth, id);

            if(typeof response === 'string') {
                toast({
                description: response
                })
                return;
            }

            toast({ description: 'Date of birth updated' });
            
            if(typeof response === 'object' && typeof response !== null) {
                loginUser();
            }
            
        } catch (error) {
            console.error("Error submitting activation code ", error);
        } finally {
            setIsLoading(false)
        }
    }
  
  
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            
            <div className="h-auto flex flex-col justify-center item-center gap-1">

                <FormField
                    control={form.control}
                    name='dateOfBirth'
                    render={({ field }) => (

                        <div className='flex flex-col gap-1'>
                            <FormLabel className='text-color-60 text-sm'>Date of birth</FormLabel>
                            <div className='flex gap-2 w-full relative'>
                                <FormControl>
                                    <Input
                                        id='dateOfBirth'
                                        type='date'
                                        className={`w-full px-3 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none ${
                                            edit ? '' : 'border-color-10'
                                        }`}
                                        disabled={edit}
                                        { ...field }
                                    />
                                </FormControl>

                                <Image
                                    src='/edit-icon.svg'
                                    width={20}
                                    height={20}
                                    alt='edit icon'
                                    className='absolute top-[25%] right-2 cursor-pointer'
                                    onClick={() => setEdit(!edit)}
                                />
                            </div>
                        </div>
                    )}
                />

                <Button type='submit' 
                    disabled={isLoading}
                    className='bg-light-gradient-135deg text-xs text-color-30 rounded-full self-end h-7 px-8'
                >
                    {isLoading ? 'Loading' : 'Update'}
                </Button>

            </div>
            </form>
        </Form>
    )
}

export default DateOfBirthForm