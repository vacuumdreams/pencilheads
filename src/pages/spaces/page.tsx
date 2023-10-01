import React from 'react'
import { User } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { where, documentId } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSpaceCollection, useInviteCollection } from '@/hooks/use-data'
import { auth } from '@/services/firebase'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Alert,
  AlertTitle,
  AlertDescription
} from "@/components/ui/alert"
import { SpaceCard } from './card'
import { InviteCard } from './invite-card'
import { CreateSpace } from './create'
import { Guard } from '@/components/auth/guard'
import { Invite, Space } from '@/types'

type InviteWithId = Invite & {
  id: string
}

type SpacesContentProps = {
  user: User
  invites: Record<string, Invite>
}

const SpacesContent = ({ user, invites }: SpacesContentProps) => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const invitesBySpace = Object.keys(invites).reduce<Record<string, InviteWithId>>((acc, id) => {
    const invite = invites[id]
    acc[invite.spaceId] = { id, ...invite }
    return acc
  }, {})
  const inviteSpaceIds = Object.keys(invitesBySpace)
  const [inviteSpaces, inviteLoading, inviteError] = inviteSpaceIds.length ? useSpaceCollection({
    filters: [where(documentId(), 'in', inviteSpaceIds)],
  }) : [{} as Record<string, Space>, false, null]
  const [spaces, loading, error] = useSpaceCollection({
    filters: [where(`members.${user?.uid}`, '!=', null)]
  })

  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: `${inviteError}`,
        variant: 'destructive'
      })
    }
  }, [inviteError])

  if (error) {
    return (
      <Alert variant='destructive' className='mt-16 max-w-xl mx-auto text-center'>
        <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
          <Icons.warning width={16} />
          <span>Error</span>
        </AlertTitle>
        <AlertDescription>
          <p>{`${error}`}</p>
          <Button onClick={() => navigate('/')} className='mt-4'>
            Reload
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!user || loading || inviteLoading || !inviteSpaces || !spaces) {
    return (
      <div className='flex items-center justify-center w-full py-24'>
        <Icons.spinner className='animate-spin' />
      </div>
    )
  }

  if (Object.keys(inviteSpaces).length === 0 && (!spaces || typeof spaces !== 'object')) {
    return (
      <CreateSpace user={user}>
        <AlertTitle className='flex gap-2 items-center justify-center mb-4 text-xl mb-8'>
          <Icons.warning width={16} />
          <span>No spaces</span>
        </AlertTitle>
        <AlertDescription>
          <p>You are not part of any groups just yet.</p>
        </AlertDescription>
      </CreateSpace>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Object.keys(inviteSpaces).map(id => {
        const invite = invitesBySpace[id]

        if (!invite) return null

        return (
          <InviteCard
            className="bg-muted"
            key={id}
            inviteId={invite.id}
            invite={invite}
            space={inviteSpaces[id]}
          />
        )
      })}
      {Object.keys(spaces).map(id => (
        <SpaceCard
          key={id}
          id={id}
          space={spaces[id]}
        />
      ))}
      <CreateSpace user={user} />
    </div>
  )
}

const InviteWrapper = () => {
  const { toast } = useToast()
  const [user] = useAuthState(auth)
  const [invites, loading, error] = useInviteCollection({
    filters: [
      where('email', '==', user?.email),
      where('accepted', '==', false),
    ]
  })

  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: `${error}`,
        variant: 'destructive'
      })
    }
  }, [error])

  if (!user || !invites || loading) {
    return (
      <div className='flex items-center justify-center w-full py-24'>
        <Icons.spinner className='animate-spin' />
      </div>
    )
  }

  return (
    <SpacesContent user={user} invites={invites} />
  )
}

export const Spaces = () => {
  return (
    <Guard>
      <h1 className="font-mono text-4xl text-center mt-12 mb-16">pencilheads</h1>
      <InviteWrapper />
    </Guard>
  )
}
