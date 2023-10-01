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
import { Event } from '@/types';

export const EventsEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [snapshot, _loading, error] = useEvent({ id })

  const val = snapshot?.data()
  const event: Event | null = val ? {
    ...val,
    createdAt: new Date(val.createdAt),
    updatedAt: new Date(val.updatedAt),
    scheduledFor: new Date(val.scheduledFor),
  } : null

  return (
    <Guard>
      {error && (
        <Alert variant="destructive" className='max-w-xl mx-auto text-center'>
          <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
            <Icons.warning width={16} />
            <span>Error</span>
          </AlertTitle>
          <AlertDescription>
            <p>Failed loading events</p>
            <p>{error.message}</p>
          </AlertDescription>
        </Alert>
      )}
      {event && (
        <EventForm event={event} onBack={() => navigate('/')} />
      )}
    </Guard>
  )
}
