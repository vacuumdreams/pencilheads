import React from 'react'
import { User } from 'firebase/auth'
import { deleteField } from 'firebase/firestore'
import { Event } from '@/types'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { Avatar, AvatarGroup } from '@/components/avatar-group'
import { Movies } from './movies'
import { Menu } from './menu'
import { PastEvent } from './past-event'
import { useMutate } from '@/hooks/use-mutate'
import { getUser } from '@/lib/utils'

type EventItemProps = {
  user: User
  spaceId: string
  isAdmin: boolean
  id: string
  event: Event
}

export const EventItem: React.FC<EventItemProps> = ({ user, spaceId, isAdmin, id, event }) => {
  const { update, loading } = useMutate<Partial<Event>>('event')
  const hasJoined = !!user.email && !!event.attendance?.[user.uid]
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
    return <PastEvent event={event} />
  }

  return (
    <div className='relative w-full flex border px-4 pt-12 sm:pt-4 mb-8'>
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
        {event.approvedByHost && (
          <div className="w-full flex gap-4 justify-between items-center mb-6">
            <AvatarGroup
              maxDisplay={3}
              people={Object.values(event.attendance || {})}
            />
            <div className='flex gap-2'>
              {hasJoined && (
                <Button
                  disabled={loading}
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
              {!hasJoined && (
                <Button
                  disabled={loading || now > event.scheduledFor || event.venue.maxParticipants <= currentParticipants}
                  onClick={() => {
                    update(`events/${spaceId}/events/${id}`, {
                      [`attendance.${user.uid}`]: {
                        ...getUser(user),
                        markedAt: new Date(),

                      }
                    })
                  }}
                >
                  {event.venue.maxParticipants <= currentParticipants && 'Event full'}
                  {now >= event.scheduledFor && 'In progress'}
                  {now < event.scheduledFor && event.venue.maxParticipants > currentParticipants && 'Join'}
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
        {!event.approvedByHost && (
          <div className="flex gap-4">
            {!event.approvedByHost && (
              <div className="w-full sm:flex gap-4 justify-between mb-4">
                <p className="mb-4 sm:mb-0 gap-4 flex items-center justify-between sm:justify-start">
                  <span className="flex items-center">
                    <Avatar person={event.createdBy} className="inline-flex mr-2" />
                    {event.createdBy.name.split(' ')[0]} created this event
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
                    <Tag className="bg-muted text-lg text-muted-foreground">
                      Waiting for host approval
                    </Tag>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2 mb-2">
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
        {event.description && (
          <div className="text-left">
            <p>{event.description}</p>
          </div>
        )}
        <h2 className='my-4 font-bold text-left'>
          {Object.keys(event.movies || {}).length === 1 ? 'The movie:' : 'The movies:'}
        </h2>
        <Movies
          id={id}
          event={event}
          user={user}
          hasJoined={hasJoined}
        />
      </div>
    </div>
  )
}
