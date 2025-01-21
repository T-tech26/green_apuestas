import { UserData } from '@/types/globals'
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormLabel } from '../ui/form';
import { toast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/lib/actions/userActions';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { countries } from '@/lib/countries';
import { countrySchema } from '@/lib/utils';
import { useUser } from '@/contexts/child_context/userContext';

interface CountryFormProps {
    user: UserData | string,
}

const CountryForm = ({ user }: CountryFormProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [edit, setEdit] = useState(true);


    const { loginUser } = useUser();


    const userData = {
        country: (user as UserData)?.country,
    }


    // 1. Define your form.
    const form = useForm<z.infer<typeof countrySchema>>({
        resolver: zodResolver(countrySchema),
        defaultValues: {
          country: userData.country,
        },
    })
  
  
  
    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof countrySchema>) => {
        
        setIsLoading(true)
        try {

            const { country } = values;

            const id = (user as UserData)?.$id;

            const response = await updateUserProfile('country', country, id);

            if(typeof response === 'string') {
                toast({
                description: response
                })
                return;
            }

            toast({ description: 'City updated' });
            
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
            
            <div className="h-auto flex flex-col justify-center item-center gap-1" translate='no'>

                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (

                        <div className='flex flex-col gap-1'>
                            <FormLabel className='text-color-60 text-sm' translate='yes'>Country</FormLabel>
                            <div className='flex gap-2 w-full relative'>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className={`w-full pl-3 pr-7 py-2 text-color-60 text-sm border border-gray-600 rounded-md focus:outline-none flex justify-between items-center ${
                                                edit ? '' : 'border-color-10'
                                            }`}
                                            disabled={edit}
                                        >
                                        <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className='overflow-y-scroll h-52 bg-color-30'>
                                        {countries.map((item) => {
                                        return (
                                            <SelectItem className='cursor-pointer' key={item.name} value={item.name}>{item.name}</SelectItem>
                                        )
                                        })}
                                    </SelectContent>
                                </Select>

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

export default CountryForm