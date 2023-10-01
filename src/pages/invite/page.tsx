import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useMutate } from '@/hooks/use-mutate'
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
  const [isSuccess, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<null | string>(null)
  const { id } = useParams();
  const { update, loading } = useMutate<Partial<InviteType>>()

  React.useEffect(() => {
    update(`/invites/${id}`, { accepted: true }, {
      onSuccess: () => setSuccess(true),
      onError: (error) => setError(error)
    })
  }, [])

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

  if (error) {
    return (
      <Alert variant='destructive' className='mt-16 max-w-xl mx-auto text-center'>
        <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
          <Icons.warning width={16} />
          <span>Error</span>
        </AlertTitle>
        <AlertDescription>
          <p>Failed accepting the invitation.</p>
          <p>{error}</p>
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
          <Button onClick={() => navigate('/')}>Go to the dashboard</Button>
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
