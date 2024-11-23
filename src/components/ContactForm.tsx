import { contactFormSchema } from '@/lib/utils'
import React from 'react'
import { Control } from 'react-hook-form'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'


interface ContactInputProps {
    control: Control<z.infer<typeof contactFormSchema>>
}


const ContactForm = ({ control }: ContactInputProps) => {
    return (
        <>
            <div className="flex flex-col gap-3 md:gap-3 md:flex-row w-full">
                <FormField
                    control={control}
                    name='firstname'
                    render={({ field }) => (
                        <div className='flex flex-col gap-2 w-full'>
                            <FormLabel
                                className='text-color-30 text-base lg:text-base font-normal'
                            >
                            </FormLabel>

                            <FormControl>
                                <Input
                                placeholder='first name'
                                type='text'
                                {...field}
                                className='input'
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    )}
                />

                <FormField
                    control={control}
                    name='lastname'
                    render={({ field }) => (
                        <div className='flex flex-col gap-2 w-full'>
                            <FormLabel
                                className='text-color-30 text-base lg:text-base font-normal'
                            >
                            </FormLabel>

                            <FormControl>
                                <Input
                                placeholder='last name'
                                type='text'
                                {...field}
                                className='input'
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    )}
                />
            </div>

            <div className="flex flex-col gap-3 md:gap-3 md:flex-row w-full">
                <FormField
                    control={control}
                    name='email'
                    render={({ field }) => (
                        <div className='flex flex-col gap-2 w-full'>
                            <FormLabel
                                className='text-color-30 text-base lg:text-base font-normal'
                            >
                            </FormLabel>

                            <FormControl>
                                <Input
                                placeholder='email address'
                                type='text'
                                {...field}
                                className='input'
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    )}
                />

                <FormField
                    control={control}
                    name='phone'
                    render={({ field }) => (
                        <div className='flex flex-col gap-2 w-full'>
                            <FormLabel
                                className='text-color-30 text-base lg:text-base font-normal'
                            >
                            </FormLabel>

                            <FormControl>
                                <Input
                                placeholder='phone number'
                                type='text'
                                {...field}
                                className='input'
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    )}
                />
            </div>

            <FormField
                control={control}
                name="message"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Textarea
                        placeholder="Write your message......."
                        className='input w-full h-28'
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}

export default ContactForm