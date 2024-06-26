import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/services/firebase'
import { useMutate } from '@/hooks/use-mutate'
import { useToast } from '@/components/ui/use-toast'
import { useSpaceId } from '@/hooks/use-space'
import { getUserName, getUser } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Venue } from '@/types'

type AddVenueProps = {
  id?: string
  defaultValues?: Venue
  canAddPrivate: boolean
  onSuccess: () => void
}

export const VenueForm: React.FC<AddVenueProps> = ({ id, defaultValues, canAddPrivate, onSuccess }) => {
  const spaceId = useSpaceId()
  const { toast } = useToast()
  const [user] = useAuthState(auth)
  const { register, control, handleSubmit, formState } = useForm<Pick<Venue, 'public' | 'name' | 'city' | 'address' | 'maxParticipants'>>({
    defaultValues: defaultValues || {
      public: !canAddPrivate,
      city: 'Lisbon',
    }
  })
  const { update, push, loading } = useMutate<Venue>('venue')

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
    const venueTable = (spaceId !== 'PUBLIC' || !data.public)
      ? `users/${user.uid}/venues`
      : `venues/${spaceId}/venues`

    if (id && defaultValues) {
      await update(`${venueTable}/${id}`, {
        ...data,
        public: data.public || false,
        createdBy: defaultValues?.createdBy || getUser(user),
        createdAt: defaultValues?.createdAt || now,
        updatedAt: now,
      })
      onSuccess()
      return
    }

    push(venueTable, {
      ...data,
      public: data.public || false,
      createdBy: defaultValues?.createdBy || getUser(user),
      createdAt: defaultValues?.createdAt || now,
      updatedAt: now,
    })
    onSuccess()
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h3 className="mt-12 mb-2">Add new venue</h3>
      <Controller
        name="public"
        control={control}
        render={({ field }) => (
          <div className="mb-4">
            <div className="flex items-center gap-6 justify-between mb-2 p-2 border border-accent">
              <div>
                <p className="mb-2">
                  Public
                </p>
                {field.value && (
                  <div className="text-sm text-muted-foreground">
                    <Icons.info size={14} className="inline mr-2" />
                    <span>Anyone can use this place to create events.</span>
                  </div>
                )}
                {!field.value && (
                  <div className="text-sm text-muted-foreground">
                    <Icons.info size={14} className="inline mr-2" />
                    <span>Only you can create events here.</span>
                  </div>
                )}
              </div>
              <Switch
                checked={field.value}
                disabled={!canAddPrivate}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
            </div>
          </div>
        )}
      />
      <Input {...register('name', { required: true })} placeholder={`E.g. ${getUserName(user).split(' ')[0]}'s home`} />
      <Input {...register('city', { required: true })} disabled placeholder="City" />
      <Input {...register('address', { required: true })} placeholder="Address of the venue" />
      <Input {...register('maxParticipants', { required: true })} placeholder="Maximum people to host" />

      <Button disabled={loading || !formState.isValid} type="submit" onClick={(e) => e.stopPropagation()}>
        Submit
      </Button>
    </form >
  )
}
