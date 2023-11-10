import React from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/services/firebase"
import { Icons } from "@/components/icons"
import { AvatarGroup } from "@/components/avatar-group"
import { Directions } from "./directions"
import { Rate } from "./rate"
import { Event, Movie } from "@/types"

type PastEventProps = {
  id: string
  event: Event
}

const getMovie = (event: Event): Movie | null => {
  const movieKeys = Object.keys(event.movies || {})

  if (!movieKeys.length) return null

  const stats = Object.values(event.votes).reduce<Record<string, number>>(
    (acc, id) => {
      acc[id] = acc[id] ? acc[id] + 1 : 1
      return acc
    },
    { [movieKeys[0]]: 1 }
  )
  const [id] = Object.entries(stats).reduce<[string, number]>(
    (acc, [id, count]) => {
      return acc[1] > count ? acc : [id, count]
    },
    [movieKeys[0], 1]
  )
  return event.movies[id]
}

export const PastEvent = ({ id, event }: PastEventProps) => {
  const [user] = useAuthState(auth)
  const movie = React.useMemo(() => getMovie(event), [])
  const attendanceList = Object.values(event.attendance || {})

  return (
    <div className="relative w-full border px-4 pt-12 sm:pt-4">
      <div className="absolute right-0 top-0 flex gap-4 p-2 pr-6 text-gray-500">
        <div className="flex gap-2">
          <Icons.clock width={16} />
          {event.scheduledFor.getHours().toString().padStart(2, "0")}:
          {event.scheduledFor.getMinutes().toString().padStart(2, "0")}
        </div>
        <div className="flex gap-2">
          <Icons.calendar width={16} />
          {event.scheduledFor.getDate()}/{event.scheduledFor.getMonth()}/
          {event.scheduledFor.getFullYear()}
        </div>
      </div>
      <div className="w-full">
        <div className="mb-8 flex gap-2">
          <Icons.clapperboard width={32} />
          <h4 className="font-mono text-2xl">
            {event.name || `${event.createdBy.name}'s movie night`}
          </h4>
        </div>
        <div className="mb-2">
          <Directions event={event} />
        </div>
        <div className="mb-2 flex gap-2 text-center sm:text-left">
          <Icons.award width={16} />
          <p>
            organised by <strong>{event.createdBy.name?.split(" ")[0]}</strong>
          </p>
        </div>
        <div className="mb-6 flex w-full items-center justify-start gap-2">
          <Icons.users width={16} />
          <span>attendees:</span>
          <AvatarGroup maxDisplay={5} people={attendanceList} />
        </div>
      </div>
      {movie && (
        <div className="text-left">
          <h2 className="my-4 font-bold">
            {user?.uid && event.attendance[user.uid]
              ? "You watched:"
              : "They watched:"}
          </h2>
          <div className="bg-muted -mx-4 flex w-[calc(100%_+_2rem)] px-4">
            <div key={movie.imdbId} className="h-16 w-16 overflow-hidden">
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
          </div>
        </div>
      )}
      <Rate id={id} user={user} event={event} />
    </div>
  )
}
