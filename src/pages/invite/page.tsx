import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useMutate } from '@/hooks/use-mutate'
import { auth } from '@/services/firebase'
import { Invite as InviteType } from '@/types'
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert'

const InviteContent = () => {
  const navigate = useNavigate()
  const [user, _loading, userError] = useAuthState(auth)
  const [isSuccess, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<null | string>(null)
  const { id } = useParams();
  const { update, loading } = useMutate<Partial<InviteType>>()

  React.useEffect(() => {
    if (user) {
      update(`/invites/${id}`, { accepted: true, userId: user.uid }, {
        onSuccess: () => setSuccess(true),
        onError: (error) => setError(error)
      })
    }
  }, [user])

  if (loading) {
    return (
      <Alert variant='default' className='max-w-xl mx-auto text-center'>
        <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
          <Icons.spinner width={16} className="animate-rotate" />
          <span>Updating...</span>
        </AlertTitle>
        <AlertDescription>
          <p>Failed loading events</p>
        </AlertDescription>
      </Alert>
    )
  }

  if (error || userError) {
    return (
      <Alert variant='destructive' className='mt-16 max-w-xl mx-auto text-center'>
        <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
          <Icons.warning width={16} />
          <span>Error</span>
        </AlertTitle>
        <AlertDescription>
          <p>Failed accepting the invitation.</p>
          <p>{error || `${userError}`}</p>
        </AlertDescription>
      </Alert>
    )
  }

  if (isSuccess) {
    return (
      <Alert variant='default' className='max-w-xl mx-auto text-center'>
        <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
          <Icons.check width={16} />
          <span>Success!</span>
        </AlertTitle>
        <AlertDescription>
          <p>Invitation accepted.</p>
          <Button onClick={() => navigate('/dashboard')}>Go to the dashboard</Button>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

export const Invite = () => {
  return (
    <div>
      <h1 className="font-mono text-4xl text-center mt-12 mb-16">pencilheads</h1>
      <InviteContent />
    </div>
  )
}
