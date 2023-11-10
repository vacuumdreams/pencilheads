import React from "react"
import { NavLink } from "react-router-dom"
import { User } from "firebase/auth"
import { deleteField } from "firebase/firestore"
import { Event } from "@/types"
import { Icons } from "@/components/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { Tag } from "@/components/ui/tag"
import { Avatar, AvatarGroup } from "@/components/avatar-group"
import { Movies } from "./movies"
import { Menu } from "./menu"
import { Directions } from "./directions"
import { PastEvent } from "./past-event"
import { useMutate } from "@/hooks/use-mutate"
import { cn, getUser } from "@/lib/utils"

type EventItemProps = {
  user?: User
  spaceId: string
  isAdmin: boolean
  id: string
  event: Event
}

export const EventItem: React.FC<EventItemProps> = ({
  user,
  spaceId,
  isAdmin,
  id,
  event,
}) => {
  const { update, loading } = useMutate<Partial<Event>>("event")
  const hasJoined = user && !!user.email && !!event.attendance?.[user.uid]
  const currentParticipants = Object.keys(event.attendance || {}).length
  const [now, setNow] = React.useState(new Date())

  React.useEffect(() => {
    const fourHoursAfter = new Date(now).setHours(new Date(now).getHours() + 4)
    if (new Date(fourHoursAfter) < event.scheduledFor) {
      const t = setTimeout(() => {
        setNow(new Date())
      }, event.scheduledFor.getTime() - fourHoursAfter)

      return () => clearTimeout(t)
    }
  }, [now, event.scheduledFor])

  if (now > event.scheduledFor) {
    return <PastEvent id={id} event={event} />
  }

  return (
    <div className="relative mb-8 flex w-full border px-4 pt-12 sm:pt-4">
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
        {event.approvedByHost && (
          <div className="mb-6 flex w-full items-center justify-between gap-4">
            <AvatarGroup
              maxDisplay={3}
              people={Object.values(event.attendance || {})}
            />
            <div className="flex gap-2">
              {!user && (
                <NavLink
                  to="/login"
                  className={buttonVariants({ variant: "default" })}
                >
                  Sign up to join
                </NavLink>
              )}
              {user && hasJoined && (
                <Button
                  disabled={loading || !user}
                  variant="outline"
                  onClick={() => {
                    update(`events/${spaceId}/events/${id}`, {
                      [`attendance.${user.uid}`]: deleteField(),
                    })
                    update(`events/${spaceId}/events/${id}`, {
                      [`votes.${user.uid}`]: deleteField(),
                    })
                  }}
                >
                  Leave
                </Button>
              )}
              {user && !hasJoined && (
                <Button
                  disabled={
                    !user ||
                    loading ||
                    now > event.scheduledFor ||
                    event.venue.maxParticipants <= currentParticipants
                  }
                  onClick={() => {
                    if (!user) {
                      return
                    }
                    update(`events/${spaceId}/events/${id}`, {
                      [`attendance.${user.uid}`]: {
                        ...getUser(user),
                        markedAt: new Date(),
                      },
                    })
                  }}
                >
                  {event.venue.maxParticipants <= currentParticipants &&
                    "Event full"}
                  {now >= event.scheduledFor && "Happening now"}
                  {now < event.scheduledFor &&
                    event.venue.maxParticipants > currentParticipants &&
                    "Join"}
                </Button>
              )}
              {hasJoined && (
                <Menu
                  eventId={id}
                  now={now}
                  schedule={event.scheduledFor}
                  user={user}
                  isAdmin={isAdmin}
                  event={event}
                />
              )}
            </div>
          </div>
        )}
        {user && !event.approvedByHost && (
          <div className="flex gap-4">
            {!event.approvedByHost && (
              <div className="mb-4 w-full justify-between gap-4 sm:flex">
                <p className="mb-4 flex items-center justify-between gap-4 sm:mb-0 sm:justify-start">
                  <span className="flex items-center">
                    <Avatar
                      person={event.createdBy}
                      className="mr-2 inline-flex"
                    />
                    {event.createdBy.name.split(" ")[0]} created this event
                  </span>
                </p>
                {event.venue.createdBy.uid === user.uid && (
                  <div>
                    <Button
                      disabled={loading}
                      onClick={() => {
                        update(`events/${spaceId}/events/${id}`, {
                          approvedByHost: true,
                        })
                      }}
                    >
                      Confirm hosting
                    </Button>
                  </div>
                )}
                {event.venue.createdBy.uid !== user.uid && (
                  <div>
                    <Tag className="bg-muted text-muted-foreground text-lg">
                      Waiting for host approval
                    </Tag>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="mb-2">
          <Directions event={event} />
        </div>
        {event.description && (
          <div className="text-left">
            <p>{event.description}</p>
          </div>
        )}
        <h2 className="my-4 text-left font-bold">
          {Object.keys(event.movies || {}).length === 1
            ? "The movie:"
            : "The movies:"}
        </h2>
        <Movies id={id} event={event} user={user} hasJoined={hasJoined} />
      </div>
    </div>
  )
}
