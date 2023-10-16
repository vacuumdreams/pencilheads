import React from 'react'
import { User } from 'firebase/auth'
import {
  useDeleteUser,
} from 'react-firebase-hooks/auth'
import { auth } from '@/services/firebase'
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/use-toast"

type DeleteFormProps = {
  user: User
  onCancel: () => void
}

export const DeleteForm = ({ user, onCancel }: DeleteFormProps) => {
  const { toast } = useToast()
  const [mutate, loading, error] = useDeleteUser(auth)

  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: `${error}`,
        variant: 'destructive',
      })
    }
  }, [error])

  return (
    <div className="pt-8">
      <p className="text-base mb-8">
        Are you sure you want to delete your account? This action cannot be undone.
      </p>
      <div className='flex gap-2'>
        <Button disabled={loading} variant='destructive' onClick={() => mutate()}>
          Yes, go ahead
        </Button>
        <Button disabled={loading} variant='outline' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
