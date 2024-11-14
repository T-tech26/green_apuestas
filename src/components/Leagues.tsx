import React from 'react'
import { LeaguesDetails } from '@/constants'
import Image from 'next/image'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormMessage } from './ui/form'
import { Input } from './ui/input'

const Leagues = () => {

  const formSchema = z.object({
    query: z.string().min(3),
  })

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        query: "",
      },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values)
      form.reset();
  }

  return (
    <aside
      className='bg-light-gradient-180deg-reverse px-[29px] py-8 hidden lg:block'
    >

      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          
          <div className="h-auto mb-5">

          <FormField
              control={form.control}
              name='query'
              render={({ field }) => (
                  <div className='flex flex-col gap-2 w-full'>
                      <FormControl>
                          <Input
                          placeholder='Search for leagues...'
                          {...field}
                          className='py-2 px-3 placeholder:text-color-30 text-sm focus:border-none focus:outline-none bg-color-60 bg-opacity-80'
                          />
                      </FormControl>
                      <FormMessage />
                  </div>
              )}
          />
          </div>
          </form>
      </Form>

      {LeaguesDetails.map((item) => {
        return (
          <p
            className='flex gap-2 items-center py-2 text-color-30 text-sm hover:border-color-60 hover:border-b-2 cursor-pointer'
          >
            <Image 
                src={item.icon}
                width={20}
                height={20}
                alt='league icon'
            />

            {item.league}
          </p>
        )
      })}
    </aside>
  )
}

export default Leagues