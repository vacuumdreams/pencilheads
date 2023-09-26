import React from 'react'
import { nanoid } from 'nanoid'
import { useForm } from 'react-hook-form'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/services/firebase'
import { useSet } from '@/hooks/use-set'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Venue } from '@/types'

type AddVenueProps = {
  onSuccess: () => void
}

export const AddVenue: React.FC<AddVenueProps> = ({ onSuccess }) => {
  const { toast } = useToast()
  const [user] = useAuthState(auth)
  const { register, handleSubmit } = useForm<Pick<Venue, 'name' | 'address' | 'maxParticipants'>>()
  const { mutate, loading, error } = useSet<Venue>()

  const onSubmit = handleSubmit(async (data) => {
    if (!user || !user.email) {
      toast({
        title: 'Error',
        description: 'You need to be logged in to add a venue',
        variant: 'destructive'
      })
    }
    await mutate(`venues/${nanoid()}`, {
      ...data,
      createdBy: user.email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    onSuccess()
  })

  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
    }
  }, [error])

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h3 className="mt-12 mb-4">Add new venue</h3>
      <Input {...register('name')} placeholder="Name of the venue" />
      <Input {...register('address')} placeholder="Address of the venue" />
      <Input {...register('maxParticipants')} placeholder="Maximum number of people the place can host" />

      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </form >
  )
}
