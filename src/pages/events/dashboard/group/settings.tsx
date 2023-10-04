import { useForm } from 'react-hook-form'
import { useMutate } from '@/hooks/use-mutate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Space } from '@/types'

type FormData = {
  telegramGroupId: string
  telegramInviteLink: string
}

type GroupSettingsProps = {
  isAdmin: boolean
  spaceId: string
  space: Space
}

export const GroupSettings = ({ isAdmin, space, spaceId }: GroupSettingsProps) => {
  const { update, loading } = useMutate<Partial<Space>>()
  const { register, handleSubmit, formState } = useForm<FormData>({
    defaultValues: {
      telegramGroupId: space.telegramGroupId,
      telegramInviteLink: space.telegramInviteLink
    }
  })

  const onSubmit = handleSubmit((data) => {
    update(`spaces/${spaceId}`, data)
  })

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <Input
          disabled={!isAdmin}
          {...register('telegramGroupId')}
        />
      </div>
      <div className="mb-4">
        <Input
          disabled={!isAdmin}
          {...register('telegramInviteLink')}
        />
      </div>
      <Button disabled={!formState.isValid || !isAdmin || loading}>Save</Button>
    </form>
  )
}
