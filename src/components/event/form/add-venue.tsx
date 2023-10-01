import React from 'react'
import { useForm } from 'react-hook-form'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/services/firebase'
import { useMutate } from '@/hooks/use-mutate'
import { useToast } from '@/components/ui/use-toast'
import { useSpaceId } from '@/hooks/use-space'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Venue } from '@/types'

type AddVenueProps = {
  onSuccess: () => void
}

export const AddVenue: React.FC<AddVenueProps> = ({ onSuccess }) => {
  const spaceId = useSpaceId()
  const { toast } = useToast()
  const [user] = useAuthState(auth)
  const { register, handleSubmit, formState } = useForm<Pick<Venue, 'name' | 'address' | 'maxParticipants'>>()
  const { push, loading } = useMutate<Venue>()

  const onSubmit = handleSubmit(async (data) => {
    const now = new Date()
    if (!user?.email) {
      toast({
        title: 'Error',
        description: 'You need to be logged in to add a venue',
        variant: 'destructive'
      })
      return
    }
    await push(`venues/${spaceId}/venues`, {
      ...data,
      createdBy: user.email,
      createdAt: now,
      updatedAt: now,
    })
    onSuccess()
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h3 className="mt-12 mb-4">Add new venue</h3>
      <Input {...register('name', { required: true })} placeholder="Name of the venue" />
      <Input {...register('address', { required: true })} placeholder="Address of the venue" />
      <Input {...register('maxParticipants', { required: true })} placeholder="Maximum number of people the place can host" />

      <Button disabled={loading || !formState.isValid} type="submit" onClick={(e) => e.stopPropagation()}>
        Submit
      </Button>
    </form >
  )
}
