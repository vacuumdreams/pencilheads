import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useToast } from '@/components/ui/use-toast';
import { signInWithGoogle } from '@/services/oauth';
import { auth } from '@/services/firebase';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { isValidEmail } from '@/lib/utils';

type FormData = {
  email: string
  password: string
}

type SigninProps = {
  onChangeToSignup: () => void
}

export function Signin({ onChangeToSignup }: SigninProps) {
  const { toast } = useToast()
  const { register, handleSubmit } = useForm<FormData>()

  const [
    signInWithEmailAndPassword,
    _user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  const onSubmit = handleSubmit(({ email, password }) => {
    signInWithEmailAndPassword(email, password)
  })

  useEffect(() => {
    if (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }, [error])

  return (
    <div>
      <Card className='max-w-xl mx-auto my-8'>
        <CardHeader>
          <CardTitle className='text-center'>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className='flex flex-col gap-6'>
            <Input
              {...register('email', { required: true, validate: isValidEmail })}
              disabled={loading}
              type="email"
              placeholder="Email address"
            />
            <Input
              {...register('password', { required: true })}
              disabled={loading}
              type="password"
              placeholder="Password"
            />
            <div className='flex justify-center'>
              <Button className='flex gap-2' disabled={loading} type="submit">
                <Icons.logIn width={16} />
                <span>Sign in</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className='flex justify-center my-6'>
        <Button className='flex gap-2' onClick={signInWithGoogle}>
          <Icons.google width={16} />
          <span>Sign in with Google</span>
        </Button>
      </div>
      <div className='text-center px-4'>
        Dont't have an account yet?{' '}<a className="cursor-pointer underline font-bold" onClick={onChangeToSignup}>Create one here</a>
      </div>
    </div>
  );
}
