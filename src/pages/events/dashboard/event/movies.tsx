import { Icons } from '@/components/icons'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Tag } from '@/components/ui/tag'
import { cn } from '@/lib/utils'
import { Event } from '@/types'

type MoviesProps = {
  event: Event
}

export const Movies = ({ event }: MoviesProps) => {
  return (
    <div className={cn('', {
      'flex': event.movies.length > 1,
    })}>
      <Accordion type="single" collapsible className="w-full">
        {event.movies.map(movie => (
          <AccordionItem key={movie.imdbId} value={movie.imdbId}>
            <AccordionTrigger className="bg-muted pr-4">
              <div key={movie.imdbId} className='w-16 h-16 overflow-hidden'>
                <img className="object-cover object-center" src={movie.poster} alt={movie.title} />
              </div>
              <div className='w-full p-4 flex gap-2 justify-between'>
                <h3>{movie.title}{' '}({movie.year})</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="">
              <p className='p-4 mb-2'>{movie.plot}</p>
              <div className="p-4 grid md:grid-cols-2 gap-2">
                <h4 className="font-bold">Awards</h4>
                <p>{movie.awards || 'N/A'}</p>
                <h4 className="font-bold">Directed by:</h4>
                <div>{movie.director}</div>
                <h4 className="font-bold">Cast:</h4>
                <div>{movie.actors}</div>
                <h4 className="font-bold">Genre:</h4>
                <div>
                  {movie.tags?.map(tag => (
                    <Tag key={tag}>
                      {tag}
                    </Tag>
                  )) || 'N/A'}
                </div>
                <h4 className="font-bold">IMDB Rating:</h4>
                <a
                  href={`https://imdb.com/title/${movie.imdbId}`}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="underline flex gap-3 items-center text-gray-500"
                >
                  <Icons.star width={16} />
                  <span className="font-mono text-lg">{movie.imdbRating}</span>
                </a>
              </div>
              {movie.trailer && (
                <div className="flex w-full justify-center mt-4">
                  <iframe
                    width="560"
                    height="315"
                    src={movie.trailer}
                    title={`Trailer: ${movie.title}`}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
