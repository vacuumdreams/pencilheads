import React from "react"
import { QueryFieldFilterConstraint } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/services/firebase"
import { useEventCollection } from '@/hooks/use-data'
import { Icons } from "@/components/icons"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { EventDateLabel } from "./date-label"
import { EventItem } from "./item"

type EventListProps = {
  isAdmin: boolean
  filters: QueryFieldFilterConstraint[]
  noEventsMessage: React.ReactNode | string
}

export const EventList: React.FC<EventListProps> = ({ isAdmin, filters, noEventsMessage }) => {
  const [user] = useAuthState(auth)
  const [events, loading, error] = useEventCollection({ filters })

  if (!user || loading) {
    return (
      <div className="flex w-full p-16 justify-center">
        <Icons.spinner className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className='max-w-xl mx-auto text-center'>
        <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
          <Icons.warning width={16} />
          <span>Error</span>
        </AlertTitle>
        <AlertDescription>
          <p>Failed loading events</p>
          <p>{`${error}`}</p>
        </AlertDescription>
      </Alert>
    )
  }

  if (!events || typeof events !== 'object' || Object.keys(events).length === 0) {
    return (
      <Alert className='max-w-xl mx-auto text-center'>
        <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
          <Icons.help width={16} />
          <span>No data</span>
        </AlertTitle>
        <AlertDescription>
          {noEventsMessage}
        </AlertDescription>
      </Alert>
    )
  }

  const keys = Object.keys(events)

  return (
    <ul className="ml-2 pl-4 md:pl-8 py-4 border-l border-muted">
      {keys.map((key, index) => (
        <li key={key}>
          <EventDateLabel
            date={events[key].scheduledFor}
            prevDate={keys[index - 1] ? events[keys[index - 1]]?.scheduledFor : undefined}
          />
          <EventItem id={key} user={user} isAdmin={isAdmin} event={events[key]} />
        </li>
      ))}
    </ul>
  )
}
