import React from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/services/firebase"
import { Event } from "@/types"
import { Icons } from "@/components/icons"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { EventDateLabel } from "./date-label"
import { EventItem } from "./item"

type EventListProps = {
  events: Event[]
  noEventsMessage: React.ReactNode | string
}

export const EventList: React.FC<EventListProps> = ({ events, noEventsMessage }) => {
  const [user] = useAuthState(auth)

  if (!events || events.length === 0) {
    return (
      <Alert className='max-w-xl mx-auto text-center'>
        <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
          <Icons.help width={16} />
          <span>No data</span>
        </AlertTitle>
        <AlertDescription>
          <p>{noEventsMessage}</p>
        </AlertDescription>
      </Alert>
    )
  }
  return (
    <ul className="ml-2 pl-4 md:pl-8 py-4 border-l border-muted">
      {user && events?.map((event, index) => (
        <li key={index}>
          <EventDateLabel
            date={event.scheduledForDate}
            prevDate={events[index - 1]?.scheduledForDate}
          />
          <EventItem user={user} event={event} />
        </li>
      ))}
    </ul>
  )
}
