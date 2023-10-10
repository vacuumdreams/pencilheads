import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/services/firebase';
import { useToast } from '@/components/ui/use-toast';
import { useMutate } from '@/hooks/use-mutate'
import { useMovie } from '@/hooks/use-movie';
import { getUserName } from '@/lib/utils';
import { useSpaceId } from '@/hooks/use-space';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/date-picker';
import { VenueSelector } from './venue'
import { Movies } from './movies';
import { Tags } from './tags';
import { Event } from '@/types';
import { FormData } from './types'

type CreateEventProps = {
  id?: string
  event?: Event
  onBack: () => void
}

const setTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':')
  date.setHours(parseInt(hours))
  date.setMinutes(parseInt(minutes))
  return date
}

const getTime = (date: Date) => {
  return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
}

const transformEvent = (event: Event): FormData => {
  return {
    ...event,
    movies: Object.values(event.movies),
    scheduledForTime: getTime(event?.scheduledFor),
  }
}

// const getMovies = async (event: Event, data: FormData, fetchMovies: (ids: string[]) => Promise<Event['movies']>) => {
//   const newIds = data.movies.reduce<string[]>((acc, movie) => {
//     if (!event.movies[movie.imdbId]) {
//       acc.push(movie.imdbId)
//     }
//     return acc
//   }, [])
//   await fetchMovies(newIds)
// }

export const EventForm: React.FC<CreateEventProps> = ({ id, event, onBack }) => {
  const spaceId = useSpaceId()
  const [user] = useAuthState(auth)
  const { toast } = useToast();
  const { register, control, handleSubmit, setValue, formState } = useForm<FormData>({
    defaultValues: event ? transformEvent(event) : {
      scheduledForTime: '19:00',
    },
  });
  const { push, update, loading } = useMutate<Event>()
  const { mutate: getMovies, loading: isMoviesLoading } = useMovie()

  const onSubmit = handleSubmit(async (data) => {
    if (!data.movies?.length) {
      toast({
        title: 'Error',
        description: 'You must add at least one movie',
        variant: 'destructive',
      })
      return
    }

    if (!data.scheduledFor) {
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

    // @TODO: optimive fecthing movies - do not call on every item on every update
    const movieList = await getMovies(data.movies.map(m => m.imdbId))
    const movies = movieList.reduce((acc, movie) => {
      acc[movie.imdbId] = movie
      return acc
    }, {} as Event['movies'])

    if (user && user.email) {
      const now = new Date()
      const userName = getUserName(user)

      const mutation: Event = {
        name: data.name || `${userName.split(' ')[0]}'s movie night`,
        createdAt: data.createdAt || now,
        createdBy: data.createdBy || {
          email: user.email,
          name: userName,
          photoUrl: user.photoURL,
        },
        updatedAt: now,
        scheduledFor: setTime(data.scheduledFor, data.scheduledForTime),
        expenses: 0,
        tags: data.tags || [],
        venue: data.venue,
        attendance: data.attendance || {
          [user.uid]: {
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            photoUrl: user.photoURL,
            markedAt: now,
          },
        },
        guests: data.guests || {},
        votes: data.votes || {},
        movies,
      }

      if (event && id) {
        await update(`events/${spaceId}/events/${id}`, mutation, {
          onSuccess: onBack,
        })
      } else {
        await push(`events/${spaceId}/events`, mutation, {
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
            name="scheduledFor"
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

        {/* <Tags register={register} control={control} /> */}

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
