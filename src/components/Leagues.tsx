import React, { useState } from 'react'
import Image from 'next/image'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { useLeague } from '@/contexts/child_context/leagueContext'
import { Loader2 } from 'lucide-react'

const Leagues = () => {

  const { leagues, setLeagueID } = useLeague();
  const [selectedLeague, setSelectedLeague] = useState<number>(0);


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
      className='w-[281px] h-[99.5%] bg-light-gradient-180deg-reverse px-[29px] py-8 hidden lg:block'
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

      {leagues.length === 0 ? (
        <div className='w-full h-full flex justify-center items-center'>
          <Loader2 size={50} className='animate-spin text-color-30'/>
        </div>
      ): (
        leagues.map((item) => {
          return (
            <p
              key={item.id}
              className={`bg-opacity-90 text-wrap flex gap-1 items-center py-3 text-color-30 text-xs hover:border-color-60 hover:border-b-2 cursor-pointer ${selectedLeague === item.id ? 'bg-color-60' : ''}`}
              onClick={() => {
                setLeagueID(item.id)
                setSelectedLeague(item.id)
              }}
            >
              <Image 
                  src={item.logo}
                  width={20}
                  height={20}
                  alt='league icon'
              />
  
              {item.name}
            </p>
          )
        })
      )}
    </aside>
  )
}

export default Leagues