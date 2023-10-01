import React from 'react'
import { useForm } from 'react-hook-form'
import { User } from 'firebase/auth'
import { useToast } from '@/components/ui/use-toast'
import { useMutate } from '@/hooks/use-mutate'
import { useSpaceId } from '@/hooks/use-space'
import { getUserName } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Invite as InviteType, Member } from '@/types'
import { isValidEmail } from '@/lib/utils'

type FormData = {
  email: string
}

type InviteProps = {
  user: User
  members: Member[]
  onSuccess: (email: string) => void
}

export const InviteForm: React.FC<InviteProps> = ({ user, onSuccess }) => {
  const spaceId = useSpaceId()
  const { toast } = useToast();
  const { register, handleSubmit, formState } = useForm<FormData>()
  const { push, loading } = useMutate<InviteType>()

  const onSubmit = handleSubmit(async ({ email }) => {
    const now = new Date()
    if (email === user?.email) {
      toast({
        title: 'Error',
        description: 'You cannot invite yourself',
        variant: 'destructive',
      })
      return
    }
    if (!spaceId) {
      console.error('No space id found')
      return
    }
    await push(`invites`, {
      email,
      spaceId,
      accepted: false,
      acceptedAt: null,
      expiresAt: new Date(new Date(now).setMonth(now.getMonth() + 1)),
      createdAt: now,
      createdBy: {
        name: getUserName(user),
        email: user?.email || '',
      },
    })

    onSuccess(email)
  })

  return (
    <div>
      <h3 className="my-4">Invite someone</h3>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Input
          type="email"
          {...register('email', { required: true, validate: isValidEmail })}
          placeholder='Email address'
        />
        <Button disabled={loading || !formState.isValid} type="submit">Invite</Button>
      </form>
    </div>
  )
}
