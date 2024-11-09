import React from 'react'
import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { authFormSchema } from '@/lib/utils'


interface CustomInput {
    control: Control<z.infer<typeof authFormSchema>>,
    name: FieldPath<z.infer<typeof authFormSchema>>,
    label: string,
    placeholder: string
}

const CustomInput = ({ control, name, label, placeholder }: CustomInput) => {
  return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <>
            <FormLabel
                className='text-color-30 text-xl font-normal'
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
            </>
        )}
    />
  )
}

export default CustomInput