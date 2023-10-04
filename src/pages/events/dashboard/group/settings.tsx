import React from 'react';
import { useForm } from 'react-hook-form'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useMutate } from '@/hooks/use-mutate'
import { Icons } from '@/components/icons'
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
  const [justCopied, setJustCopied] = React.useState<string | null>(null)
  const { update, loading } = useMutate<Partial<Space>>()
  const { register, handleSubmit, formState, getValues } = useForm<FormData>({
    defaultValues: {
      telegramGroupId: space.telegramGroupId,
      telegramInviteLink: space.telegramInviteLink
    }
  })

  React.useEffect(() => {
    if (justCopied) {
      setTimeout(() => {
        setJustCopied(null)
      }, 3000)
    }
  }, [justCopied])

  const onSubmit = handleSubmit((data) => {
    update(`spaces/${spaceId}`, data)
  })

  return (
    <form onSubmit={onSubmit}>
      <div className="w-full flex gap-2 mb-4 items-end">
        <div className="w-full">
          <label htmlFor='telegramGroupId'>
            Telegram group ID
          </label>
          <Input
            id="telegramGroupId"
            disabled={!isAdmin}
            {...register('telegramGroupId')}
          />
        </div>
        <CopyToClipboard text={getValues('telegramGroupId')} onCopy={() => setJustCopied('telegramGroupId')}>
          <Button variant="outline">
            {justCopied === 'telegramGroupId' ? <Icons.check width={12} /> : <Icons.copy width={12} />}
          </Button>
        </CopyToClipboard>
      </div>
      <div className="w-full flex gap-2 mb-4 items-end">
        <div className="w-full">
          <label htmlFor='telegramInviteLink'>
            Telegram invite link
          </label>
          <Input
            id="telegramInviteLink"
            disabled={!isAdmin}
            {...register('telegramInviteLink')}
          />
        </div>
        <CopyToClipboard text={getValues('telegramInviteLink')} onCopy={() => setJustCopied('telegramInviteLink')}>
          <Button variant="outline">
            {justCopied === 'telegramInviteLink' ? <Icons.check width={12} /> : <Icons.copy width={12} />}
          </Button>
        </CopyToClipboard>
      </div>
      <Button
        type="submit"
        disabled={!formState.isValid || !formState.isDirty || !isAdmin || loading}
      >
        Save
      </Button>
    </form>
  )
}
