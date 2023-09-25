import React from 'react'
import { useForm } from 'react-hook-form'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/services/firebase';
import { useToast } from '@/components/ui/use-toast'
import { useSet } from '@/hooks/use-set'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FormData = {
  email: string
}

type InviteProps = {
  onSuccess: (email: string) => void
}

export const Invite: React.FC<InviteProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [user] = useAuthState(auth);
  const { register, handleSubmit } = useForm<FormData>()
  const { mutate, loading, error } = useSet()

  const onSubmit = handleSubmit(async ({ email }) => {
    await mutate(`invites/${email}`, {
      email,
      accepted: false,
      createdBy: user?.email,
    })
    onSuccess(email)
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
    <div>
      <h3 className="my-4">Invite someone</h3>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Input type="email" {...register('email')} placeholder='Email address' />
        <Button disabled={loading} type="submit">Invite</Button>
      </form>
    </div>
  )
}
