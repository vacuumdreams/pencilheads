import React from 'react';
import { nanoid } from 'nanoid';
import { useForm, Controller } from 'react-hook-form';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/services/firebase';
import { useToast } from '@/components/ui/use-toast';
import { useSet } from '@/hooks/use-set'
import { useMovie } from '@/hooks/use-movie';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Event } from '@/types';
import { VenueSelector } from './venue'
import { FormData } from './types'
import { DatePicker } from '@/components/date-picker';
import { Movies } from './movies';

type CreateEventProps = {
  onBack: () => void
}

export const CreateEvent: React.FC<CreateEventProps> = ({ onBack }) => {
  const [showFood, setShowFood] = React.useState(false)
  const [user] = useAuthState(auth)
  const { toast } = useToast();
  const { register, control, handleSubmit, setValue, formState } = useForm<FormData>({
    defaultValues: {
      scheduledForTime: '19:00',
    },
  });
  const { mutate, loading, error } = useSet<Event>()
  const { mutate: getMovies, loading: isMoviesLoading, error: moviesError } = useMovie()

  console.log(formState.errors, formState.isDirty, formState.isSubmitting, formState.isValid)

  const onSubmit = handleSubmit(async (data) => {
    const now = new Date()

    if (!data.movies?.length) {
      toast({
        title: 'Error',
        description: 'You must add at least one movie',
        variant: 'destructive',
      })
      return
    }

    if (!data.scheduledForDate) {
      toast({
        title: 'Error',
        description: 'You must select a date for the event',
        variant: 'destructive',
      })
      return
    }

    if (!data.venue.name) {
      toast({
        title: 'Error',
        description: 'You must select a venue for the event',
        variant: 'destructive',
      })
      return
    }

    const movies = await getMovies(data.movies.map(m => m.imdbId))

    if (user && user.email) {
      mutate(`events/${nanoid()}-${nanoid()}`, {
        createdAt: now,
        createdBy: user.email,
        updatedAt: now,
        scheduledForDate: data.scheduledForDate,
        scheduledForTime: data.scheduledForTime,
        expenses: data.expenses,
        food: data.food?.name ? {
          name: data.food?.name,
          description: data.food?.description,
        } : null,
        venue: {
          name: data.venue.name,
          address: data.venue.address,
          maxParticipants: data.venue.maxParticipants,
        },
        subscriptions: [{
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          photoUrl: user.photoURL,
          guests: 0,
        }],
        movies,
      })
    } else {
      toast({
        title: 'Error',
        description: 'You must be logged with a valid email address in order to create an event',
        variant: 'destructive',
      })
    }
  })

  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error || moviesError,
        variant: 'destructive',
      })
    }

    if (moviesError) {
      toast({
        title: 'Error',
        description: moviesError,
        variant: 'destructive',
      })
    }
  }, [error, moviesError])

  return (
    <div>
      <div className='flex'>
        <Button className='flex gap-2' variant='secondary' onClick={onBack}>
          <Icons.arrowLeft />
          <span>Back</span>
        </Button>
      </div>

      <form className="flex flex-col gap-4 mt-8" onSubmit={onSubmit}>
        <VenueSelector setValue={setValue} />

        <div className='flex gap-2'>
          <Controller
            name="scheduledForDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="scheduledForTime"
            control={control}
            render={({ field }) => (
              <Input
                type="time"
                className="w-44"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className='relative'>
          <span className='absolute flex justify-center items-center h-full w-12 bg-gray-100'>€</span>
          <Input {...register('expenses')} placeholder='Budget' className='pl-16' type="number" />
        </div>

        <Movies control={control} />

        <Button
          className={cn('', {
            'hidden': showFood,
          })}
          onClick={() => setShowFood(true)}
        >
          Add food
        </Button>

        <div className={cn('flex flex-col gap-4', {
          'hidden': !showFood,
        })}>
          <div className='relative'>
            <span className='absolute flex justify-center items-center h-full w-12 bg-gray-100'>
              <Icons.utensils width={12} />
            </span>
            <Input {...register('food.name')} placeholder='What food?' className='pl-16' />
          </div>
          <Textarea {...register('food.description')} placeholder="Info about the food you're planning to provide" />
        </div>

        <div className='2-full flex justify-center my-4'>
          <Button disabled={loading || isMoviesLoading} type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}
