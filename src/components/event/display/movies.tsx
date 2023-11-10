import { User } from "firebase/auth"
import { Icons } from "@/components/icons"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Tag } from "@/components/ui/tag"
import { cn } from "@/lib/utils"
import { Event } from "@/types"
import { VoteButton } from "./vote"

type MoviesProps = {
  id: string
  event: Event
  user?: User
  hasJoined: boolean
}

export const Movies = ({ id, event, user, hasJoined }: MoviesProps) => {
  const movies = Object.keys(event.movies || {}).sort()
  return (
    <div className={cn("-mx-4")}>
      <Accordion type="single" collapsible className="w-full">
        {movies.map((key, index) => {
          const movie = event.movies[key]
          return (
            <div
              key={index}
              className="flex w-full items-stretch [&_h3]:w-full"
            >
              <AccordionItem
                className="w-full"
                key={movie.imdbId}
                value={movie.imdbId}
              >
                <div className="flex w-full items-stretch gap-1">
                  <AccordionTrigger className="bg-muted w-full px-4">
                    <div
                      key={movie.imdbId}
                      className="h-16 w-16 overflow-hidden"
                    >
                      <img
                        className="object-cover object-center"
                        src={movie.poster}
                        alt={movie.title}
                      />
                    </div>
                    <div className="flex w-full justify-between gap-2 p-4 text-left">
                      <div>
                        {movie.title} ({movie.year})
                      </div>
                    </div>
                  </AccordionTrigger>
                  {user && movies.length > 1 && (
                    <div className="mr-4 flex items-center [&_button]:py-8">
                      <VoteButton
                        user={user}
                        event={event}
                        eventId={id}
                        movieKey={key}
                        hasJoined={hasJoined}
                      />
                    </div>
                  )}
                </div>
                <AccordionContent className="text-center sm:text-left">
                  <p className="mb-2 p-4">{movie.plot}</p>
                  <div className="grid gap-2 p-4 md:grid-cols-2">
                    <h4 className="font-bold">Awards</h4>
                    <p>{movie.awards || "N/A"}</p>
                    <h4 className="font-bold">Directed by:</h4>
                    <div>{movie.director}</div>
                    <h4 className="font-bold">Cast:</h4>
                    <div>{movie.actors}</div>
                    {movie.tags?.length > 0 && (
                      <>
                        <h4 className="font-bold">Genre:</h4>
                        <div>
                          {movie.tags?.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                          )) || "N/A"}
                        </div>
                      </>
                    )}
                    <h4 className="font-bold">IMDB Rating:</h4>
                    <a
                      href={`https://imdb.com/title/${movie.imdbId}`}
                      rel="noreferrer noopener"
                      target="_blank"
                      className="flex items-center gap-3 text-gray-500 underline"
                    >
                      <Icons.star width={16} />
                      <span className="font-mono text-lg">
                        {movie.imdbRating}
                      </span>
                    </a>
                  </div>
                  {movie.trailer && (
                    <div className="mt-4 flex w-full justify-center">
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
            </div>
          )
        })}
      </Accordion>
    </div>
  )
}
