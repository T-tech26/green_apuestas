import React from 'react'
import { Control, FieldPath, UseFormTrigger } from 'react-hook-form'
import { z } from 'zod'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { authFormSchema } from '@/lib/utils'

interface CustomInput {
    control: Control<z.infer<typeof authFormSchema>>,
    trigger: UseFormTrigger<z.infer<typeof authFormSchema>>,
    name: FieldPath<z.infer<typeof authFormSchema>>,
    label: string,
    placeholder: string,
};

const CustomInput = ({ control, trigger, name, label, placeholder }: CustomInput) => {

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <div className='flex flex-col gap-2 w-full'>
                    <FormLabel
                        className='text-color-30 text-base lg:text-base font-normal'
                    >
                        {label}
                    </FormLabel>

                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            type={name === 'password' ? 'password' : name === 'dateOfBirth' ? 'date' : 'text'}
                            {...field}
                            className='input'
                            onFocus={() => name === 'password' && trigger(name)}
                        />
                    </FormControl>
                    <FormMessage />
                </div>
            )}
        />
    )
}

export default CustomInput