import React from "react"
import {
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
} from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/services/firebase"
import { useEventCollection } from "@/hooks/use-data"
import { Icons } from "@/components/icons"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { EventDateLabel } from "./date-label"
import { EventItem } from "./item"

type EventListProps = {
  isAdmin: boolean
  spaceId: string
  filters: Array<QueryFieldFilterConstraint | QueryOrderByConstraint>
  noEventsMessage: React.ReactNode | string
}

export const EventList: React.FC<EventListProps> = ({
  isAdmin,
  spaceId,
  filters,
  noEventsMessage,
}) => {
  const [user] = useAuthState(auth)
  const [events, loading, error] = useEventCollection({ spaceId, filters })

  if (loading) {
    return (
      <div className="flex w-full justify-center p-16">
        <Icons.spinner className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-xl text-center">
        <AlertTitle className="mb-4 flex items-center justify-center gap-2">
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

  if (
    !events ||
    typeof events !== "object" ||
    Object.keys(events).length === 0
  ) {
    return (
      <Alert className="mx-auto max-w-xl text-center">
        <AlertTitle className="mb-4 flex items-center justify-center gap-2">
          <Icons.help width={16} />
          <span>No data</span>
        </AlertTitle>
        <AlertDescription>{noEventsMessage}</AlertDescription>
      </Alert>
    )
  }

  const keys = Object.keys(events)

  return (
    <ul className="border-muted ml-2 border-l py-4 pl-4 md:pl-8">
      {keys.map((key, index) => (
        <li key={key}>
          <EventDateLabel
            date={events[key].scheduledFor}
            prevDate={
              keys[index - 1]
                ? events[keys[index - 1]]?.scheduledFor
                : undefined
            }
          />
          <EventItem
            id={key}
            user={user}
            spaceId={spaceId}
            isAdmin={isAdmin}
            event={events[key]}
          />
        </li>
      ))}
    </ul>
  )
}
