import React from 'react'
import { where } from 'firebase/firestore'
import { User } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { VenueForm } from '@/components/venue/form'
import { Tag } from '@/components/ui/tag'
import { useEventCount } from '@/hooks/use-data'
import { useMutate } from '@/hooks/use-mutate'
import { useSpaceId } from '@/hooks/use-space'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { Venue } from '@/types'

type VenueListProps = {
  id: string
  venue: Venue
  user: User
  canAddPrivate: boolean
}

export const VenueItem = ({ id, venue, user, canAddPrivate }: VenueListProps) => {
  const spaceId = useSpaceId()
  const { toast } = useToast()
  const [count, loading, error] = useEventCount({
    filters: [where('venue.id', '==', id)],
  })
  const [isEditingOpen, setEditingOpen] = React.useState(false)
  const [isDeletingOpen, setDeletingOpen] = React.useState(false)
  const venueTable = (spaceId !== 'PUBLIC' || !venue.public)
    ? `users/${user.uid}/venues`
    : `venues/${spaceId}/venues`

  const { remove } = useMutate<Venue>('venue')

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
    <div>
      <Dialog open={isEditingOpen} onOpenChange={setEditingOpen}>
        <DialogContent>
          <VenueForm
            id={id}
            defaultValues={venue}
            canAddPrivate={canAddPrivate}
            onSuccess={() => setEditingOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isDeletingOpen} onOpenChange={setDeletingOpen}>
        <DialogContent>
          <DialogDescription>
            Are you sure you want to delete <strong>"{venue.name}"</strong>
          </DialogDescription>
          <DialogFooter>
            <Button
              variant='destructive'
              onClick={async () => {
                await remove(`${venueTable}/${id}`)
                setDeletingOpen(false)
              }}
            >
              Yes, go ahead
            </Button>
            <Button
              variant='outline'
              className='mb-4 sm:mb-0'
              onClick={() => setDeletingOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card key={venue.createdAt.toString()}>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Tag className={cn('tracking-wider', {
              'bg-muted text-white': !venue.public,
            })}>
              {venue.public ? 'Public' : 'Private'}
            </Tag>
            <span className='text-left'>{venue.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='text-left'>
          <CardDescription>
            {venue.createdBy.uid === user.uid ? 'Created by you' : (
              <>
                Created by: {venue.createdBy.name?.split(' ')[0]}
              </>
            )}
          </CardDescription>
          <CardDescription>
            Address: {venue.address}
          </CardDescription>
          <CardDescription>
            Max capacity: {venue.maxParticipants} people
          </CardDescription>
          <CardDescription>
            Scheduled: {count} events
          </CardDescription>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            variant='outline'
            className="flex gap-2"
            disabled={venue.createdBy.uid !== user.uid}
            onClick={() => setEditingOpen(true)}
          >
            <Icons.pencil />
            <span>Edit</span>
          </Button>
          <Button
            variant='destructive'
            className="flex gap-2"
            disabled={loading || count > 0 || venue.createdBy.uid !== user.uid}
            onClick={() => setDeletingOpen(true)}
          >
            <Icons.trash />
            <span>Delete</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
