import { UserData } from '@/types/globals'
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { toast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/lib/actions/userActions';
import { citySchema } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

interface CityFormProps {
    user: UserData | string,
    setUser: (user: UserData | string) => void
}

const CityForm = ({ user, setUser }: CityFormProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [edit, setEdit] = useState(true);


    const userData = {
        city: (user as UserData)?.city,
    }


    // 1. Define your form.
    const form = useForm<z.infer<typeof citySchema>>({
        resolver: zodResolver(citySchema),
        defaultValues: {
          city: userData.city,
        },
    })
  
  
  
    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof citySchema>) => {
        
        setIsLoading(true)
        try {

            const { city } = values;

            const id = (user as UserData)?.$id;

            const response = await updateUserProfile('city', city, id);

            if(typeof response === 'string') {
                toast({
                description: response
                })
            }
            
            if(typeof response === 'object' && typeof response !== null) setUser(response);
            
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
                    name='city'
                    render={({ field }) => (
                        
                        <div className='flex flex-col gap-1'>
                            <FormLabel className='text-color-60 text-sm'>City</FormLabel>
                            <div className='flex gap-2 w-full relative'>
                                <FormControl>
                                    <Input
                                        id='city'
                                        type='text'
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
                    className='bg-light-gradient-135deg text-xs text-color-30 rounded-full self-end h-7 px-8'                            >
                    {isLoading ? (
                    <>
                        <Loader2 size={20} className='animate-spin'/> &nbsp; 
                        Loading...
                    </>
                    ): 'Update'}
                </Button>

            </div>
            </form>
        </Form>
    )
}

export default CityForm