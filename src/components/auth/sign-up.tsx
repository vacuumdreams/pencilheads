import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { auth } from '../../services/firebase'
import { useToast } from '../ui/use-toast';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { isValidEmail } from '@/lib/utils';

type FormData = {
  name: string
  email: string
  password: string
}

type SignupProps = {
  onChangeToSignin: () => void
}

export function Signup({ onChangeToSignin }: SignupProps) {
  const { toast } = useToast()
  const { register, handleSubmit } = useForm<FormData>()

  const [
    createUserWithEmailAndPassword,
    _user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  const [updateProfile, updateLoading, updateError] = useUpdateProfile(auth)

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    await createUserWithEmailAndPassword(email, password)
    await updateProfile({
      displayName: name,
    })
  })

  const signInWithGoole = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  useEffect(() => {
    if (error) {
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
          <CardTitle className='text-center'>Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className='flex flex-col gap-6'>
            <Input
              {...register('name', { required: true })}
              disabled={loading}
              type="text"
              placeholder="Your name"
            />
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
                <span>Register</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className='flex justify-center my-6'>
        <Button className='flex gap-2' onClick={signInWithGoole}>
          <Icons.google width={16} />
          <span>Sign in with Google</span>
        </Button>
      </div>
      <div className='text-center px-4'>
        Already have an account?{' '}<a className="cursor-pointer underline font-bold" onClick={onChangeToSignin}>Sign in here</a>
      </div>
    </div>
  );
}
