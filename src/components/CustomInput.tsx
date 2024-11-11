import React from 'react'
import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { authFormSchema } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = authFormSchema('register');

interface CustomInput {
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string,
    placeholder: string
}

/* eslint-enable @typescript-eslint/no-unused-vars */
const CustomInput = ({ control, name, label, placeholder }: CustomInput) => {

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
                    type={name === 'password' ? 'password' : 'text'}
                    {...field}
                    className='input'
                    />
                </FormControl>
                <FormMessage />
            </div>
        )}
    />
  )
}

export default CustomInput