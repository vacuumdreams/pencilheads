import React from 'react'
import { User } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/services/firebase'
import {
  useVenueCollection,
  usePrivateVenueCollection,
} from '@/hooks/use-data'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Guard } from '@/components/auth/guard'
import { VenueItem } from './item'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { VenueForm } from '@/components/venue/form'
import { Venue } from '@/types'

const getVenuesWithIds = (venues: Record<string, Venue>) => {
  return Object.entries(venues).map(([id, venue]) => ({
    id,
    ...venue,
  }))
}

const VenuesGuarded = ({ user }: { user: User }) => {
  const { toast } = useToast()
  const [isAddingOpen, setAddingOpen] = React.useState(false)
  const [venues, vLoading, vError] = useVenueCollection();
  const [pVenues, pvLoading, pvError] = usePrivateVenueCollection()
  const pVenueList = getVenuesWithIds(pVenues || {})
  const venueList = pVenueList.concat(getVenuesWithIds(venues || {}))
  const publicByUser = venueList.reduce((acc, v) => {
    if (v.createdBy.uid === user.uid) {
      return acc + 1
    }
    return acc
  }, 0)

  React.useEffect(() => {
    if (pvError) {
      toast({
        title: 'Error',
        description: `${pvError}`,
        variant: 'destructive',
      })
    }
  }, [pvError])

  React.useEffect(() => {
    if (vError) {
      toast({
        title: 'Error',
        description: `${vError}`,
        variant: 'destructive',
      })
    }
  }, [vError])

  return (
    <div className="">
      <Dialog open={isAddingOpen} onOpenChange={setAddingOpen}>
        <DialogContent>
          <VenueForm
            canAddPrivate={pVenueList.length === 0}
            onSuccess={() => setAddingOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <div className="-mt-12">
        <div className='flex justify-end'>
          <Button
            disabled={vLoading || pvLoading || (publicByUser >= 3 && pVenueList.length > 0)}
            onClick={() => setAddingOpen(true)}
          >
            <Icons.plus />
            <span className="hidden sm:inline-block">Create venue</span>
          </Button>
        </div>
      </div>
      <main className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {user && venueList.map((venue) => (
          <VenueItem
            id={venue.id}
            user={user}
            venue={venue}
            canAddPrivate={pVenueList.length === 0}
          />
        ))}
      </main>
    </div>
  )
}

export const Venues = () => {
  const [user] = useAuthState(auth)

  return (
    <Guard>
      {user && <VenuesGuarded user={user} />}
    </Guard>
  )
}
