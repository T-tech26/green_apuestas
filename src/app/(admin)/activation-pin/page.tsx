'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { deleteActivationPin, generateActivationPin, getActivationPins } from '@/lib/actions/userActions';
import { GeneratedCode } from '@/types/globals';

const ActivationPin = () => {

    const [loading, setLoading] = useState(false);
    const [pin, setPin] = useState<GeneratedCode | string>('');
    const [allPins, setAllPins] = useState<GeneratedCode[] | string>('');



    useEffect(() => {
        const getPins = async () => {
            const response = await getActivationPins();
            if(typeof response === 'string') {
                toast({
                    description: response
                });
                setAllPins([]);
            } else {
                setAllPins(response);
            }
        }

        getPins();
    }, [pin]);



    const handleCopyClick = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
    
            toast({
                description: 'Copied successfully',
            });
        } catch (error) {
            console.error("Failed to copy text:", error);
            toast({
                description: 'Failed to copy text',
            });
        }
    };
    

    const generatePin = async () => {
        setLoading(true);
        try {
            // Generate a random number between 100000 and 999999
            const pin = Math.floor(Math.random() * 900000) + 100000;
    
            const response = await generateActivationPin(pin.toString());

            if(typeof response === 'string') {
                toast({
                    description: response,
                });
            }

            if(typeof response === 'object') setPin(response);
            
        } catch (error) {
            console.error('Error generating PIN:', error);
            toast({
                description: 'Error generating code'
            })
        } finally {
            setLoading(false);
        }
    };


    const deletePin = async (id: string, code: string) => {
        try {
            const response = await deleteActivationPin(id, code);

            if(Array.isArray(response)) setAllPins(response);
            
        } catch (error) {
            console.error('Error generating PIN:', error);
            toast({
                description: 'Error deleting pin! try again'
            })
        }
    }

    
    return (
        <main className='flex-1 py-14 overflow-x-hidden overflow-y-scroll'>
            <div className='w-4/5 mx-auto flex flex-col gap-10'>
                <h1 className='text-lg text-color-60 font-medium uppercase'>Subscription</h1>

                <div
                    className='w-full px-5 py-3 border border-color-10 rounded-md flex flex-col-reverse gap-2 md:flex-row items-center justify-between'
                >
                    {typeof pin === 'object' ? (
                        <div className='flex justify-between items-center w-16'>
                            <p className='text-sm text-color-10'>
                                {(pin as GeneratedCode).code}
                            </p>

                            <Image
                                src='/copy-content-icon.svg'
                                width={15}
                                height={15}
                                alt='menu icons'
                                className='cursor-pointer'
                                onClick={() => handleCopyClick((pin as GeneratedCode).code)}
                            />
                        </div>
                    ): (<div></div>)}

                    <Button type='button' 
                        disabled={loading}
                        className='bg-light-gradient-135deg rounded-full'
                        onClick={() => generatePin()}
                    >
                        {loading ? (
                        <>
                            <Loader2 size={20} className='animate-spin'/> &nbsp; 
                            Loading...
                        </>
                        ): 'Generate activation pin'}
                    </Button>
                </div>

                <div className='w-full py-5 flex flex-col gap-5'>
                    <h1 className='w-full text-base text-color-10 font-medium border-b border-color-10 text-center'>Generated Pins</h1>

                    <div className='relative w-full h-28 flex justify-center items-center flex-wrap gap-3'>
                        {Array.isArray(allPins) && (allPins as GeneratedCode[]).length > 0 ? (
                            <>
                                {(allPins as GeneratedCode[]).map(pin => {
                                    return (
                                        <p
                                            key={pin.$id}
                                            className='text-sm text-color-30 bg-light-gradient-135deg px-3 py-1 flex items-center gap-2 rounded-full'
                                        >
                                            {pin.code}

                                            <Image
                                                src='/close.svg'
                                                width={15}
                                                height={15}
                                                alt='close icon'
                                                className='cursor-pointer'
                                                onClick={() => {
                                                    deletePin(pin.$id, pin.code);
                                                    setAllPins('');
                                                }}
                                            />
                                        </p>
                                    )
                                })}
                            </>
                        ) : Array.isArray(allPins) && (allPins as GeneratedCode[]).length === 0 ? (
                            <p className='text-xs text-color-60'>No pins generated</p>
                        ) : (
                            <div className="absolute top-0 bottom-0 right-0 left-0 w-full h-full flex justify-center items-center">
                                <Loader2 size={40} className="animate-spin text-color-10" />
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </main>
    )
}

export default ActivationPin