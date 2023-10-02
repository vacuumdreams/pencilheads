import { useParams, useNavigate } from 'react-router-dom'
import { Icons } from '@/components/icons'
import { Guard } from '@/components/auth/guard';
import {
  Alert,
  AlertTitle,
  AlertDescription
} from "@/components/ui/alert"
import { EventForm } from '@/components/event/form'
import { useEvent } from '@/hooks/use-data'
import { useSpaceId } from '@/hooks/use-space'

const EventsEditContent = () => {
  const { id } = useParams()
  const spaceId = useSpaceId()
  const navigate = useNavigate()
  const [event, loading, error] = useEvent({ id })

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

  if (loading) {
    return (
      <div className="flex w-full p-16 justify-center">
        <Icons.spinner className="animate-spin" />
      </div>
    )
  }

  return (
    <>
      {event && (
        <EventForm id={id} event={event} onBack={() => navigate(`/${spaceId}`)} />
      )}
    </>
  )
}

export const EventsEdit = () => {
  return (
    <Guard>
      <h1 className="w-full flex gap-2 items-center justify-center font-mono text-4xl text-center mt-12 mb-16">
        <Icons.pencil />
        <span>Edit event</span>
      </h1>
      <EventsEditContent />
    </Guard>
  )
}
