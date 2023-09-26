import React from "react"
import { Event } from "@/types"
import { Icons } from "@/components/icons"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { EventDateLabel } from "./event-date-label"
import { EventItem } from "./event-item"

type EventListProps = {
  events: Event[]
  noEventsMessage: React.ReactNode | string
}

export const EventList: React.FC<EventListProps> = ({ events, noEventsMessage }) => {
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
    <ul className="ml-2 pl-8 py-4 border-l border-gray-300">
      {events?.map((event, index) => (
        <li key={index}>
          <EventDateLabel
            date={event.scheduledForDate}
            prevDate={events[index - 1]?.scheduledForDate}
          />
          <EventItem event={event} />
        </li>
      ))}
    </ul>
  )
}
