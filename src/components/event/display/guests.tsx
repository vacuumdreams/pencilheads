import { User } from 'firebase/auth'
import { useForm, useFieldArray } from 'react-hook-form'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutate } from '@/hooks/use-mutate'
import { useSpaceId } from '@/hooks/use-space'
import { Event, Guest } from '@/types'
import { isValidEmail, getUserName } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

type FormData = {
  guests: Array<{
    name: string
    email: string
  }>
}

type JoinProps = {
  eventId: string
  user: User
  event: Event
  onClose: () => void
}

export const Guests = ({ eventId, user, event, onClose }: JoinProps) => {
  const spaceId = useSpaceId()
  const { toast } = useToast()
  const { register, control, handleSubmit, formState: { isValid } } = useForm<FormData>({
    defaultValues: {
      guests: Object.values(event.guests?.[user.uid] || {}),
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'guests',
  })
  const { set, loading } = useMutate<Guest[]>()

  const onSubmit = handleSubmit(async (data) => {
    const now = new Date()
    const userName = getUserName(user)

    await set(`events/${spaceId}/events/${eventId}/guests/${user.uid}`, data.guests.map((guest) => {
      return {
        name: guest.name,
        email: guest.email,
        invitedAt: now,
        confirmedAt: null,
        invitedBy: {
          email: user.email || '',
          name: userName,
        }
      }
    }), {
      onSuccess: () => {
        onClose()
        toast({
          title: 'Invites sent',
          description: 'Your guests have been invited to the event.',
        })
      },
    })

  })

  return (
    <form onSubmit={onSubmit}>
      <div className='w-full flex gap-2 justify-between'>
        <p>Bringing any guests?</p>
        <Button onClick={(e) => {
          e.preventDefault()
          append({ name: '', email: '' })
        }}>
          <Icons.add />
        </Button>
      </div>
      {fields.map((field, i) => (
        <div className='w-full flex gap-2 my-2' key={field.id}>
          <Input
            type='text'
            placeholder='Guest name'
            {...register(`guests.${i}.name`, { required: true })}
          />
          <Input
            type='email'
            placeholder='Email address'
            {...register(`guests.${i}.email`, { required: true, validate: isValidEmail })}
          />
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              remove(i)
            }}
          >
            <Icons.close />
          </Button>
        </div>
      ))}

      <Button
        disabled={!isValid || loading}
        className='w-full mt-8'
        type='submit'
      >
        {fields.length > 1 ? 'Send invites' : 'Send invite'}
      </Button>
    </form>
  )
}
