import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/services/firebase';
import { useToast } from '@/components/ui/use-toast';
import { useMutate } from '@/hooks/use-mutate'
import { useMovie } from '@/hooks/use-movie';
import { cn, getUserName } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DBEvent, Event } from '@/types';
import { VenueSelector } from './venue'
import { FormData } from './types'
import { DatePicker } from '@/components/date-picker';
import { Movies } from './movies';

type CreateEventProps = {
  event?: Event
  onBack: () => void
}

export const EventForm: React.FC<CreateEventProps> = ({ event, onBack }) => {
  const [showFood, setShowFood] = React.useState(event?.food?.name ? true : false)
  const [user] = useAuthState(auth)
  const { toast } = useToast();
  const { register, control, handleSubmit, setValue, formState } = useForm<FormData>({
    defaultValues: event || {
      scheduledForTime: '19:00',
    },
  });
  const { push, update, loading } = useMutate<DBEvent>()
  const { mutate: getMovies, loading: isMoviesLoading } = useMovie()

  const onSubmit = handleSubmit(async (data) => {
    const now = Date.now()

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
      const userName = getUserName(user)
      const mutation: DBEvent = {
        name: data.name || `${userName.split(' ')[0]}'s movie night`,
        createdAt: now,
        createdBy: {
          email: user.email,
          name: userName,
          photoUrl: user.photoURL,
        },
        updatedAt: now,
        scheduledForDate: data.scheduledForDate.getTime(),
        scheduledForTime: data.scheduledForTime,
        expenses: 0,
        food: data.food?.name ? {
          name: data.food.name,
          description: data.food?.description,
        } : null,
        venue: data.venue,
        subscriptions: {
          [user.uid]: {
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            photoUrl: user.photoURL,
            subscribedAt: now,
          },
        },
        guests: {},
        movies,
      }

      if (event) {
        await update(`events/${event.id}`, mutation, {
          onSuccess: onBack,
        })
      } else {
        await push(`events`, mutation, {
          onSuccess: onBack,
        })
      }
    } else {
      toast({
        title: 'Error',
        description: 'You must be logged with a valid email address in order to create an event',
        variant: 'destructive',
      })
    }
  })

  return (
    <div>
      <div className='flex'>
        <Button className='flex gap-2' variant='secondary' onClick={onBack}>
          <Icons.arrowLeft />
          <span>Back</span>
        </Button>
      </div>

      <form className="flex flex-col gap-4 mt-8" onSubmit={onSubmit}>
        <Input {...register('name')} placeholder='Name your event. What is the theme?' />

        <VenueSelector
          defaultVenue={event?.venue}
          setValue={setValue}
        />

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

        <Movies control={control} />

        <Button
          className={cn('', {
            'hidden': showFood,
          })}
          onClick={(e) => {
            e.preventDefault()
            setShowFood(true)
          }}
        >
          Add food
        </Button>

        <div className={cn('flex flex-col gap-4', {
          'hidden': !showFood,
        })}>
          <div className='relative'>
            <span className='absolute flex justify-center items-center h-full w-12 bg-gray-100 dark:bg-gray-700'>
              <Icons.utensils width={12} />
            </span>
            <Input {...register('food.name')} placeholder='What food?' className='pl-16' />
          </div>
          <Textarea {...register('food.description')} placeholder="Info about the food you're planning to provide" />
        </div>

        <div className='2-full flex justify-center my-4'>
          <Button
            type="submit"
            disabled={loading || isMoviesLoading || !formState.isDirty || !formState.isValid}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
