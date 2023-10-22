import React from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { User } from 'firebase/auth'
import {
  useUpdatePassword,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth'
import { auth } from '@/services/firebase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  currentPassword: z.string(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords do not match"
    });
  }
})

type ProfileFormProps = {
  user: User
  onSuccess: () => void
}

export const ChangePasswordForm = ({ user, onSuccess }: ProfileFormProps) => {
  const { toast } = useToast()
  const [mutate, loading, error] = useUpdatePassword(auth)
  const [signin, _cred, signinLoading, signinError] = useSignInWithEmailAndPassword(auth)
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    }
  })

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

  React.useEffect(() => {
    if (signinError) {
      console.error(signinError)
      toast({
        title: 'Error',
        description: `${signinError}`,
        variant: 'destructive',
      })
    }
  }, [signinError])

  const onSubmit = handleSubmit(async data => {
    await signin(user.email || '', data.currentPassword)
    await mutate(data.password)
    onSuccess()
  })

  return (
    <form className="grid gap-4 w-full mt-8" onSubmit={onSubmit}>
      <p className="mb-2">Change password</p>
      <Input
        className="mb-4"
        type='password'
        placeholder='Current password'
        {...register('currentPassword', { required: true })}
      />
      <Input
        className="mb-4"
        type='password'
        placeholder='New password'
        {...register('password', { required: true })}
      />
      <Input
        className="mb-4"
        type='password'
        placeholder='Confirm password'
        {...register('confirmPassword', { required: true })}
      />
      <div className='flex'>
        <Button
          disabled={loading || signinLoading || !formState.isValid || !formState.isDirty}
          type="submit"
        >
          Save
        </Button>
      </div>
    </form>
  )
}
