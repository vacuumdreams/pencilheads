import { User } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { useMutate } from '@/hooks/use-mutate'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Space } from '@/types'
import { getUser } from '@/lib/utils'

type FormData = {
  name: string
}

type CreateSpaceProps = {
  user: User
  onSuccess: () => void
}

export const CreateSpaceForm = ({ user, onSuccess }: CreateSpaceProps) => {
  const { push, loading } = useMutate<Space>()
  const { register, handleSubmit } = useForm<FormData>()
  const me = getUser(user)

  const onSubmit = handleSubmit((data) => {
    push(`spaces`, {
      name: data.name,
      createdAt: new Date(),
      createdBy: me,
      members: {
        [user.uid]: {
          role: 'admin',
          ...me,
        },
      },
    }, { onSuccess })
  })

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input {...register('name', { required: true })} />
      <Button disabled={loading} type="submit">Create</Button>
    </form>
  )
}
