import { useUser } from '@/contexts/child_context/userContext';
import { toast } from '@/hooks/use-toast';
import { createGameTicket, creditUserBalance, userNotification } from '@/lib/actions/userActions';
import { Games, UserData, UserGame } from '@/types/globals';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Form, FormControl, FormField, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';
import { formatAmount, generateDateString } from '@/lib/utils';

const UserBetUpload = () => {

    const { allUsers } = useUser();

    const [loading, setLoading] = useState(false);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const [games, setGames] = useState<UserGame>({
        totalOdds: '',
        stake: '',
        payout: '',
        userId: '',
        date: '',
        games: []
    });



    useEffect(() => {
        document.body.style.overflowY = 'hidden';

        return () => {
            document.body.style.overflowY = '';
        }
    }, []);


    const formSchema = z.object({
        home: z.string().min(3),
        away: z.string().min(3),
        odd: z.string().min(2),
        homeGoal: z.string().min(2),
        awayGoal: z.string().min(2),
        totalOdds: z.string().min(2).optional(),
        stake: z.string().min(2).optional(),
        payout: z.string().min(2).optional(),
        userId: z.string().min(2).optional(),
        matchTime: z.string().min(3)
    });


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            home: '',
            away: '',
            homeGoal: '',
            awayGoal: '',
            odd: '',
            totalOdds: '',
            matchTime: '',
            stake: '',
            payout: '',
            userId: '',
        }
    });



    const addGame = () => {
        // Get values from the form or refs
        const newGame: Games = {
            home: form.getValues('home'),
            away: form.getValues('away'),
            odd: form.getValues('odd'),
            homeGoal: form.getValues('homeGoal'),
            awayGoal: form.getValues('awayGoal'),
            matchTime: form.getValues('matchTime'),
        };
  
        // Update the games array in the state
        setGames((prevGames) => ({
            ...prevGames,
            games: [...prevGames.games, newGame]
        }));
    
        // Optionally clear the form fields after submission
        form.reset();
    }


    // Step 3: Handle updating the rest of the user game data
    const updateUserData = () => {
        const updatedUserGames: UserGame = {
            ...games,
            totalOdds: form.getValues('totalOdds') || games.totalOdds,
            stake: form.getValues('stake') || games.stake,
            payout: form.getValues('payout') || games.payout,
            userId: form.getValues('userId') || games.userId,
        };

        setGames(updatedUserGames);

        // Optionally clear the user input fields after update
        form.reset();
    };



    const handleDeleteGame = (index: number) => {
         // Remove the game at the specified index from the games array
        const updatedGames = games.games.filter((_, i) => i !== index);

        // Update the games array in the state
        setGames((prevGames) => ({
            ...prevGames,
            games: updatedGames
        }));
    }


    const onSubmit = async () => {
        const gameDate = generateDateString();

        setLoading(true);
        try {
            // Initialize a new array for missing fields (locally)
            const newMissingFields: string[] = [];

            // Validate UserGames fields
            const userGamesFields: (keyof UserGame)[] = ['totalOdds', 'stake', 'payout', 'userId'];


            userGamesFields.forEach((field) => {
                if (!(games as UserGame)[field]) {

                    const message = `${
                        field === 'totalOdds' ? 'Total odds' 
                            : field === 'stake' ? 'Stake'
                                : field === 'payout' ? 'Payout'
                                    : 'User'
                    } is empty`
                    
                    newMissingFields.push(message);
                }
            });


            if(newMissingFields.length > 0 && games.games.length === 0) {
                toast({
                    description: `You have no games added`
                });
                return;
            }

            // Validate games array fields
            games.games.forEach((game) => {
                const gameFields: (keyof Games)[] = ['home', 'away', 'odd', 'homeGoal', 'awayGoal', 'matchTime'];
                
                gameFields.forEach((field) => {
                    if (!(game as Games)[field]) {

                        const message = `${
                            field === 'home' ? 'No home team' 
                                : field === 'away' ? 'No away team'
                                    : field === 'odd' ? 'No odd'
                                        : field === 'homeGoal' ? 'No home goal'
                                            : field === 'awayGoal' ? 'No away goal'
                                                : 'No match time added'
                        } entered`
                        
                        newMissingFields.push(message)
                    }
                });
            });



            if (newMissingFields.length > 0) {
                setMissingFields(newMissingFields);

                setTimeout(() => {
                    setMissingFields([]);
                }, 7000);
                return; // Prevent submission if there are missing field
            }


            const gamesWithDate: UserGame = {
                ...games,
                date: gameDate
            };

            const response = await createGameTicket(gamesWithDate);

            if(response === 'success') {
                toast({
                    description: 'Game uploaded successfully'
                })

                const deduct = await creditUserBalance(games.userId, games.stake, 'deduct');

                if(deduct === 'success') {
                    await userNotification(games.userId, 'deduct', gameDate, games.stake);
                }
            }

            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (error: any) {
            /* eslint-enable @typescript-eslint/no-explicit-any */
            console.error("Error creating user bet ticket", error);
        } finally {
            setLoading(false);
            setGames({
                totalOdds: '',
                stake: '',
                payout: '',
                userId: '',
                date: '',
                games: []
            })
        }
    }


    return (
        <div className='flex flex-col gap-10 items-center'>
            {games.games.length > 0 ? (                    
                <div className='bg-color-30 rounded-md w-[330px]'>
                    <div className='bg-light-gradient-135deg px-5 py-1 rounded-t-md flex justify-between'>
                        <p className='flex flex-col justify-between text-color-30 text-sm font-medium'>
                            <span>Multiple</span>
                            <span>Ticket ID: </span>
                        </p>

                        <p className='flex flex-col justify-between text-color-30 text-xs'>
                            <span>won</span>
                            <span>Date</span>
                        </p>
                    </div>

                    {games.games.map((game, index) => {
                        return (
                            <div 
                                key={index} 
                                className='px-5 py-1 border-b border-gray-300 relative'
                            >
                                <Image 
                                    src='/delete-icon.svg'
                                    width={20}
                                    height={20}
                                    alt='delete game icon'
                                    className='absolute top-0 right-0 cursor-pointer'
                                    onClick={() => handleDeleteGame(index)}
                                />

                                <div className='flex items-center relative gap-2'>
                                    <p className='text-left text-color-60 text-xs text-wrap'>{game.home}</p>
                                    <span className='text-color-60 text-xs'>vs</span>
                                    <p className='text-right text-color-60 text-xs text-wrap'>{game.away}</p>
                                </div>

                                <p className='flex items-center gap-3 text-gray-400 text-xs'>Correct score</p>

                                <p className='text-color-60 text-[10px] font-semibold flex justify-between'>{game.homeGoal} - {game.awayGoal}
                                    <span>{game.odd}</span>
                                </p>

                                <p className='text-green-400 text-[11px] font-semibold'>won</p> 

                                <p className='text-[10px] text-gray-400'>{game.matchTime}</p>
                            </div>
                        )
                    })}

                    <div className='border-t border-gray-400 px-5 py-3 rounded-b-md'>
                        <p className='flex justify-between text-color-60 text-xs'>
                            <span>Total Odds</span> 
                            <span>{games.totalOdds}</span>
                        </p>

                        <p className='flex justify-between text-color-60 text-xs'>
                            <span>Stake</span> 
                            <span>${formatAmount(games.stake)}</span>
                        </p>

                        <p className='flex justify-between text-color-60 text-xs'>
                            <span>Payout:</span> 
                            <span>${formatAmount(games.payout)}</span>
                        </p>
                    </div>
                </div>
                ) : (
                    <div className='bg-color-30 rounded-md w-[330px]'>
                        <div className='bg-light-gradient-135deg px-5 py-1 rounded-t-md flex justify-between'>
                            <p className='flex flex-col justify-between text-color-30 text-sm font-medium'>
                                <span>Multiple</span>
                                <span>Ticket ID: </span>
                            </p>

                            <p className='flex flex-col justify-between text-color-30 text-xs'>
                                <span>won</span>
                                <span>Date</span>
                            </p>
                        </div>

                        <div className='flex justify-center items-center border-gray-300 text-color-60 text-xs p-5'>
                            No games
                        </div>
                    </div>
                )}


                <div>
                    <Form {...form}>
                        <form>
                            
                            <div className='flex flex-col gap-3'>
                                <h2 className='text-color-60 text-base font-semibold'>Game details</h2>

                                <p className='text-color-60 text-sm'>You can add multiple game if you wish</p>

                                <FormField
                                    control={form.control}
                                    name='home'
                                    render={({ field }) => (
                                        <div className='w-full'>

                                            <FormControl>
                                                <Input
                                                    id='home'
                                                    placeholder='Enter home team'
                                                    type='text'
                                                    {...field}
                                                    className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='away'
                                    render={({ field }) => (
                                        <div className='w-full'>

                                            <FormControl>
                                                <Input
                                                    id='away'
                                                    placeholder='Enter away team'
                                                    type='text'
                                                    {...field}
                                                    className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    )}
                                />

                                <div 
                                    className='flex items-center gap-2'
                                >
                                    <FormField
                                        control={form.control}
                                        name='odd'
                                        render={({ field }) => (
                                            <div className='w-full'>

                                                <FormControl>
                                                    <Input
                                                        id='odd'
                                                        placeholder='Enter game odd'
                                                        type='text'
                                                        {...field}
                                                        className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='homeGoal'
                                        render={({ field }) => (
                                            <div className='w-full'>

                                                <FormControl>
                                                    <Input
                                                        id='homeGoal'
                                                        placeholder='Enter home goal'
                                                        type='text'
                                                        {...field}
                                                        className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='awayGoal'
                                        render={({ field }) => (
                                            <div className='w-full'>

                                                <FormControl>
                                                    <Input
                                                        id='awayGoal'
                                                        placeholder='Enter away goal'
                                                        type='text'
                                                        {...field}
                                                        className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name='matchTime'
                                    render={({ field }) => (
                                        <div className='w-full'>

                                            <FormControl>
                                                <Input
                                                    id='matchTime'
                                                    placeholder='Enter match date and time e.g 07/01, 09:00'
                                                    type='text'
                                                    {...field}
                                                    className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    )}
                                />

                                <Button type='button' 
                                    className='w-full bg-light-gradient-135deg text-sm text-color-30 rounded-full'
                                    onClick={() => addGame()}
                                >
                                    Add game
                                </Button>
                            </div>
                        </form>
                    </Form>

                    {missingFields.length > 0 && games.games.length !== 0 && (
                        <div className='mt-3'>
                            {missingFields.map((msg,index) => {
                                return (
                                    <p key={index} className='text-red-400 text-sm'>
                                        {msg}
                                    </p>
                                )
                            })}
                        </div>
                    )}

                    <Form {...form}>
                        <form>
                            <div className='flex flex-col gap-4'>
                                <h2 className='text-color-60 text-base font-semibold mt-3'>User Stake details</h2>

                                <FormField
                                    control={form.control}
                                    name='totalOdds'
                                    render={({ field }) => (
                                        <div className='w-full'>

                                            <FormControl>
                                                <Input
                                                    id='totalOdds'
                                                    placeholder='Enter total odds'
                                                    type='text'
                                                    {...field}
                                                    className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='stake'
                                    render={({ field }) => (
                                        <div className='w-full'>

                                            <FormControl>
                                                <Input
                                                    id='stake'
                                                    placeholder='Enter user stake amount'
                                                    type='text'
                                                    {...field}
                                                    className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='payout'
                                    render={({ field }) => (
                                        <div className='w-full'>

                                            <FormControl>
                                                <Input
                                                    id='payout'
                                                    placeholder='Enter payout'
                                                    type='text'
                                                    {...field}
                                                    className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="userId"
                                    render={({ field }) => (
                                    <div className='w-full !overflow-hidden'>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className='w-full py-2 px-3 border border-color-60 focus:border-color-10 focus:outline-none rounded-md placeholder:text-sm placeholder:text-gray-200 flex items-center justify-between'>
                                            <SelectValue placeholder="Select user to bet for" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className=''>
                                            {allUsers.length > 0 && allUsers.map(user => {
                                                return (
                                                    <SelectItem className='cursor-pointer' key={user.$id} value={user.userId}>
                                                        {user.firstname} {user.lastname}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </div>
                                    )}
                                />

                                <div className='flex items-center gap-4'>
                                    <Button type='button' 
                                        className='w-full bg-light-gradient-135deg text-sm text-color-30 rounded-full'
                                        onClick={() => updateUserData()}
                                    >
                                        Add game stake details
                                    </Button>
                                    
                                    <Button type='button' 
                                        disabled={loading}
                                        className='w-full bg-light-gradient-135deg text-sm text-color-30 rounded-full'
                                        onClick={() => onSubmit()}
                                    >
                                        {loading ? (
                                        <>
                                            <Loader2 size={20} className='animate-spin'/>&nbsp; 
                                            Loading...
                                        </>
                                        ): 'Upload ticket'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
        </div>
    )
}

export default UserBetUpload