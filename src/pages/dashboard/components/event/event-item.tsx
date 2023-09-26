import { Event } from '@/types'
import { Icons } from '@/components/icons'

type EventItemProps = {
  event: Event
}

export const EventItem: React.FC<EventItemProps> = ({ event }) => {
  return (
    <div className='w-full flex border p-4'>
      <div className="w-full my-2">
        <div className="flex gap-2">
          <Icons.mapPin width={16} />
          <div className=''>
            <p>{event.venue.name}</p>
            <p>{event.venue.address}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Icons.clock width={16} />
          {event.scheduledForTime}
        </div>
        <h2 className='my-4 font-bold'>The movies:</h2>
        {event.movies.map(movie => (
          <div className="flex bg-gray-200 gap-4">
            <div key={movie.imdbId} className='w-16 h-16 overflow-hidden'>
              <img className="object-cover object-center" src={movie.poster} alt={movie.title} />
            </div>
            <div className='w-full p-4 flex gap-2 justify-between'>
              <h3>{movie.title}</h3>
              <div className="flex gap-2 text-gray-500">
                <Icons.star width={16} />
                <span>{movie.imdbRating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
