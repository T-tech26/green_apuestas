import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { Form, FormControl, FormField, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { createProfileImage, getLoggedInUser } from '@/lib/actions/userActions';
import { isAdmin, isUserData, loggedInAdminWithImage, loggedInUserWithImage } from '@/lib/utils';
import { useUser } from '@/contexts/child_context/userContext';
import { Admin, UserData } from '@/types/globals';


interface ProfileImageFormProps {
    setProfile: (newProfile: boolean) => void,
    type: string
}

const ProfileImageForm = ({ setProfile, type }: ProfileImageFormProps) => {

    const { user, setUser, admin, setAdmin } = useUser();

    const imgRef = useRef<HTMLInputElement | null>(null);
    const [profileImg, setProfileImg] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    
    const formSchema = z.object({
        profile: z.instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'File size must be less than or equal to 5MB',
            })
            .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
            message: 'File must be PNG or JPEG',
            }),
    });
    
    
    
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profile: undefined,
        },
    });


    /* eslint-disable @typescript-eslint/no-explicit-any */
    const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        /* eslint-enable @typescript-eslint/no-explicit-any */
        const file = e.target.files?.[0];
        const reader = new FileReader();

        if(file) {
            field.onChange(file);
            reader.readAsDataURL(file);
            setProfileImg(URL.createObjectURL(file));
        }
    }



    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            
            const profileImgUpload = type === 'admin' ? await createProfileImage(values.profile, (admin as Admin).$id, 'admin') : await createProfileImage(values.profile, (user as UserData).userId, 'user');

            if(profileImgUpload !== 'success') {
                toast({
                    description: 'Something went wrong try again!'
                });
                return;
            } else {
                toast({
                    description: 'Profile image uploaded'
                });
            }

            const loggedInUser = await getLoggedInUser();
            if(typeof loggedInUser === 'string') return;

            if(isAdmin(loggedInUser)) {
                const adminWithImage = loggedInAdminWithImage(loggedInUser);
                setAdmin(adminWithImage);
                return
            }

            if(isUserData(loggedInUser)) {
                const userWithImage = loggedInUserWithImage(loggedInUser);
                setUser(userWithImage);
            }

        } catch (error) {
            toast({
                description: `Something went wrong, try again`
            });
            console.error("Error uploadiing profile image", error);
        } finally {
          form.reset();
          setProfileImg('');
          setIsLoading(false);
          setProfile(false);
        }
    }



    return (
        <div className='absolute top-16 right-5 w-[300px] bg-color-30 rounded-md px-4 py-5 flex flex-col gap-5 z-[9999]'>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    
                    <div className='flex flex-col gap-5'>

                        <FormField
                            control={form.control}
                            name='profile'
                            render={({ field }) => (
                                <div className='relative w-full'>
                                    
                                    {profileImg ? (
                                        <>
                                            <Image
                                                src={profileImg}
                                                width={100}
                                                height={100}
                                                alt='payment logo template'
                                                className='w-full h-auto cursor-pointer'
                                                onClick={() => imgRef.current?.click()}
                                            />
                                        </>
                                    ) : (
                                        <div className='relative'>
                                            <div 
                                                className='bg-gray-200 w-full h-auto rounded-[30px] p-5'
                                                onClick={() => imgRef.current?.click()}
                                            >
                                                <p className='text-gray-400 text-sm absolute top-[47%] left-[53%] transform -translate-x-[60%]'>Profile image</p>
                                                <Image
                                                    src='/banner-icon.svg'
                                                    width={300}
                                                    height={300}
                                                    alt='payment logo template'
                                                    className='cursor-pointer mx-auto'
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <FormControl>
                                        <Input
                                            id="front"
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            className='py-1 w-full text-base text-primary outline-none hidden'
                                            ref={imgRef}
                                            onChange={(e) => {
                                                handleImgUpload(e, field);
                                                field.onChange(e.target.files && e.target.files[0]);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
                        />


                        <Button type='submit' 
                            disabled={isLoading}
                            className='w-full bg-light-gradient-135deg text-sm h-8 text-color-30 rounded-full'
                        >
                            {isLoading ? (
                            <>
                                <Loader2 size={20} className='animate-spin'/>&nbsp; 
                                Loading...
                            </>
                            ): 'Upload'}
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}

export default ProfileImageForm