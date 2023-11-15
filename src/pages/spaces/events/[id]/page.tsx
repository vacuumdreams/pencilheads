import { useParams, useNavigate } from "react-router-dom"
import { Icons } from "@/components/icons"
import { Guard } from "@/components/auth/guard"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { EventForm } from "@/components/event/form"
import { useEvent } from "@/hooks/use-data"
import { useSpaceId } from "@/hooks/use-space"

const EventsEditContent = () => {
  const { id } = useParams()
  const spaceId = useSpaceId()
  const navigate = useNavigate()
  const [event, loading, error] = useEvent({ id })

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-xl text-center">
        <AlertTitle className="mb-4 flex items-center justify-center gap-2">
          <Icons.warning width={16} />
          <span>Error</span>
        </AlertTitle>
        <AlertDescription>
          <p>Failed loading event</p>
          <p>{`${error}`}</p>
        </AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="flex w-full justify-center p-16">
        <Icons.spinner className="animate-spin" />
      </div>
    )
  }

  return (
    <>
      {event && (
        <EventForm
          id={id}
          event={event}
          onBack={() => {
            if (spaceId === "PUBLIC") {
              return navigate(`/dashboard`)
            }
            return navigate(`/dashboard/spaces/${spaceId}`)
          }}
        />
      )}
    </>
  )
}

export const EventsEdit = () => {
  return (
    <Guard>
      <h1 className="mb-16 mt-12 flex w-full items-center justify-center gap-2 text-center font-mono text-4xl">
        <Icons.pencil />
        <span>Edit event</span>
      </h1>
      <EventsEditContent />
    </Guard>
  )
}
