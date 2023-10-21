import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/services/firebase'
import { Icons } from '@/components/icons'
import { AvatarGroup } from '@/components/avatar-group'
import { Event, Movie } from '@/types'

type PastEventProps = {
  event: Event
}

const getMovie = (event: Event): Movie | null => {
  const movieKeys = Object.keys(event.movies || {})

  if (!movieKeys.length) return null

  const stats = Object.values(event.votes).reduce<Record<string, number>>((acc, id) => {
    acc[id] = acc[id] ? acc[id] + 1 : 1
    return acc
  }, { [movieKeys[0]]: 1 })
  const [id] = Object.entries(stats).reduce<[string, number]>((acc, [id, count]) => {
    return acc[1] > count ? acc : [id, count]
  }, [movieKeys[0], 1])
  return event.movies[id]
}

export const PastEvent = ({ event }: PastEventProps) => {
  const [user] = useAuthState(auth)
  const movie = React.useMemo(() => getMovie(event), [])
  const attendanceList = Object.values(event.attendance || {})

  return (
    <div className='relative w-full border px-4 pt-12 sm:pt-4'>
      <div className="absolute top-0 right-0 flex gap-4 p-2 pr-6 text-gray-500">
        <div className="flex gap-2">
          <Icons.clock width={16} />
          {event.scheduledFor.getHours().toString().padStart(2, '0')}:{event.scheduledFor.getMinutes().toString().padStart(2, '0')}
        </div>
        <div className="flex gap-2">
          <Icons.calendar width={16} />
          {event.scheduledFor.getDate()}/{event.scheduledFor.getMonth()}/{event.scheduledFor.getFullYear()}
        </div>
      </div>
      <div className="w-full">
        <div className="flex gap-2 mb-8">
          <Icons.clapperboard width={32} />
          <h4 className="font-mono text-2xl">{event.name || `${event.createdBy.name}'s movie night`}</h4>
        </div>
        <div className="w-full flex gap-2">
          <a
            rel="noreferrer noopener"
            target="_blank"
            href={`https://www.google.com/maps/dir//${encodeURIComponent(event.venue.address)}`}
            className='w-full flex gap-2 justify-between items-center'
          >
            <div className='flex justify-between items-center gap-2'>
              <Icons.mapPin width={16} />
              <p>{event.venue.name}</p>
            </div>
            <span
              className="p-2 text-gray-600"
            >
              <Icons.arrowUpRightSquare />
            </span>
          </a>
        </div>
        {!!event.name && (
          <div className="mb-2">organised by <strong>{event.createdBy.name}</strong></div>
        )}
        <div className="w-full flex gap-4 justify-between items-center mb-6">
          Attendees:
          <AvatarGroup
            maxDisplay={5}
            people={attendanceList}
          />
        </div>
      </div>
      {movie && (
        <div>
          {user && (
            <h2 className='my-4 font-bold'>
              {event.attendance[user.uid] ? 'You watched:' : 'They watched:'}
            </h2>
          )}
          <div className="w-[calc(100%_+_2rem)] bg-muted px-4 -mx-4 flex">
            <div key={movie.imdbId} className='w-16 h-16 overflow-hidden'>
              <img className="object-cover object-center" src={movie.poster} alt={movie.title} />
            </div>
            <div className='w-full p-4 flex gap-2 justify-between text-left'>
              <div>{movie.title}{' '}({movie.year})</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
