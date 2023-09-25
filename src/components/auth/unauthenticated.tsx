import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
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

type FormData = {
  email: string
  password: string
}

export function Unauthenticated() {
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
          <CardTitle className='text-center'>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className='flex flex-col gap-6'>
            <Input {...register('email')} disabled={loading} type="email" />
            <Input {...register('password')} disabled={loading} type="password" />
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
        <Button className='flex gap-2' onClick={signInWithGoole}>
          <Icons.google width={16} />
          <span>Sign in with Google</span>
        </Button>
      </div>
    </div>
  );
}
