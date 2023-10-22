import React from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { User } from 'firebase/auth'
import {
  useUpdateEmail,
} from 'react-firebase-hooks/auth'
import { auth } from '@/services/firebase'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { ChangePasswordForm } from './password'

const FormSchema = z.object({
  email: z.string().email(),
})

type AccountFormProps = {
  user: User
}

export const AccountForm = ({ user }: AccountFormProps) => {
  const { toast } = useToast()
  const [isPasswordDialogOpen, setPasswordDialogOpen] = React.useState(false)
  const [mutate, loading, error] = useUpdateEmail(auth)
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: user.email || '',
    }
  })

  const canChangePassword = !!user.providerData.find(p => p.providerId === 'password')

  React.useEffect(() => {
    if (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: `${error}`,
        variant: 'destructive',
      })
    }
  }, [error])

  const onSubmit = handleSubmit(data => {
    mutate(data.email)
  })

  return (
    <div>
      <p className="text-base mb-2">
        Email address
      </p>
      <form className="grid gap-4 w-full" onSubmit={onSubmit}>
        <Input
          disabled={true}
          {...register('email', { required: true })}
        />
        <div className='flex gap-2'>
          <Button disabled={true} type="submit">
            Save
          </Button>
          {canChangePassword && (
            <Button
              disabled={loading}
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                setPasswordDialogOpen(true)
              }}
            >
              Change password
            </Button>
          )}
        </div>
      </form>
      <Dialog open={isPasswordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <ChangePasswordForm user={user} onSuccess={() => setPasswordDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
