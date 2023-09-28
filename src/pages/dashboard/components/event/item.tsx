import React from 'react'
import { User } from 'firebase/auth'
import { Event } from '@/types'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { AvatarGroup } from '@/components/avatar-group'
import { useMutate } from '@/hooks/use-mutate'
import { Subscription } from '@/types'
import { Movies } from './movies'
import { Menu } from './menu'
import { getUserName } from '@/lib/utils'

type EventItemProps = {
  user: User
  event: Event
}

const getScedule = (event: Event) => {
  const schedule = new Date(event.scheduledForDate)
  const [hh, mm] = event.scheduledForTime.split(':').map(Number)
  schedule.setHours(hh)
  schedule.setMinutes(mm)
  return schedule
}

export const EventItem: React.FC<EventItemProps> = ({ user, event }) => {
  const { set, remove, loading } = useMutate<Subscription>()
  const hasJoined = user.email && !!event.subscriptions?.[user.uid]
  const currentParticipants = Object.keys(event.subscriptions || {}).length
  const [now, setNow] = React.useState(new Date())
  const schedule = getScedule(event)

  React.useEffect(() => {
    if (now < schedule) {
      setTimeout(() => {
        setNow(new Date())
      }, schedule.getTime() - now.getTime())
    }
  }, [now, schedule])

  return (
    <div className='relative w-full flex border p-4 pt-12'>
      <div className="w-full my-2">
        <div className="w-full flex gap-4 justify-between items-center mb-6">
          <AvatarGroup
            maxDisplay={3}
            people={Object.values(event.subscriptions || {})}
          />
          <div className='flex gap-2'>
            {hasJoined && (
              <Button
                disabled={loading}
                variant="outline"
                onClick={() => remove(`events/${event.id}/subscriptions/${user.uid}`)}
              >
                Unsubscribe
              </Button>
            )}
            {!hasJoined && (
              <Button
                disabled={loading || now < schedule || event.venue.maxParticipants <= currentParticipants}
                onClick={() => {
                  set(`events/${event.id}/subscriptions/${user.uid}`, {
                    name: getUserName(user),
                    email: user.email || '',
                    subscribedAt: Date.now(),
                    photoUrl: user.photoURL,
                  })
                }}
              >
                {event.venue.maxParticipants <= currentParticipants && 'Event full'}
                {now >= schedule && 'In progress'}
                {now < schedule && event.venue.maxParticipants > currentParticipants && 'Join'}
              </Button>
            )}
            {hasJoined && (
              <Menu
                now={now}
                schedule={schedule}
                user={user}
                event={event}
              />
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Icons.user width={16} />
          <p>{event.name || `${event.createdBy.name}'s movie night`}</p>
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
        <div className="absolute top-0 right-0 flex gap-4 p-2 pr-6 text-gray-500">
          <div className="flex gap-2">
            <Icons.clock width={16} />
            {event.scheduledForTime}
          </div>
          <div className="flex gap-2">
            <Icons.calendar width={16} />
            {event.scheduledForDate.getDate()}/{event.scheduledForDate.getMonth()}/{event.scheduledForDate.getFullYear()}
          </div>
        </div>
        <h2 className='my-4 font-bold'>The movies:</h2>
        <Movies event={event} />
      </div>
    </div>
  )
}
