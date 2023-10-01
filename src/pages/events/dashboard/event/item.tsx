import React from 'react'
import { User } from 'firebase/auth'
import { Event } from '@/types'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { AvatarGroup } from '@/components/avatar-group'
import { Attendance } from '@/types'
import { Movies } from './movies'
import { Menu } from './menu'
import { useMutate } from '@/hooks/use-mutate'
import { getUserName } from '@/lib/utils'
import { useSpaceId } from '@/hooks/use-space'

type EventItemProps = {
  user: User
  id: string
  event: Event
}

export const EventItem: React.FC<EventItemProps> = ({ user, id, event }) => {
  const spaceId = useSpaceId()
  const { set, remove, loading } = useMutate<Attendance>()
  const hasJoined = user.email && !!event.attendance?.[user.uid]
  const currentParticipants = Object.keys(event.attendance || {}).length
  const [now, setNow] = React.useState(new Date())

  React.useEffect(() => {
    if (now < event.scheduledFor) {
      setTimeout(() => {
        setNow(new Date())
      }, event.scheduledFor.getTime() - now.getTime())
    }
  }, [now, event.scheduledFor])

  return (
    <div className='relative w-full flex border p-4 pt-12 sm:pt-4'>
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
      <div className="w-full my-2">
        <div className="flex gap-2 mb-8">
          <Icons.clapperboard width={32} />
          <h4 className="font-mono text-2xl">{event.name || `${event.createdBy.name}'s movie night`}</h4>
        </div>
        <div className="w-full flex gap-4 justify-between items-center mb-6">
          <AvatarGroup
            maxDisplay={3}
            people={Object.values(event.attendance || {}).map(sub => ({
              name: sub.name,
              email: sub.email,
              photoUrl: sub.photoUrl,
            }))}
          />
          <div className='flex gap-2'>
            {hasJoined && (
              <Button
                disabled={loading}
                variant="outline"
                onClick={() => remove(`events/${spaceId}/events/${id}/attendance/${user.uid}`)}
              >
                Unsubscribe
              </Button>
            )}
            {!hasJoined && (
              <Button
                disabled={loading || now < event.scheduledFor || event.venue.maxParticipants <= currentParticipants}
                onClick={() => {
                  set(`events/${spaceId}/events/${id}/attendance/${user.uid}`, {
                    name: getUserName(user),
                    email: user.email || '',
                    markedAt: new Date(),
                    photoUrl: user.photoURL,
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
                now={now}
                schedule={event.scheduledFor}
                user={user}
                event={event}
              />
            )}
          </div>
        </div>
        <div className="flex gap-2">
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
        <h2 className='my-4 font-bold'>The movies:</h2>
        <Movies event={event} />
      </div>
    </div>
  )
}
