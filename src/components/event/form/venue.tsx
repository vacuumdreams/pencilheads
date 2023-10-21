import React from 'react'
import { User } from '@firebase/auth'
import { UseFormSetValue } from 'react-hook-form'
import { usePrivateVenueCollection, useVenueCollection } from '@/hooks/use-data';
import { useToast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectSeparator,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { VenueSelectItem } from './venue-select-item'
import { AddVenue } from './add-venue';
import { Venue } from '@/types'
import { FormData } from './types'

type VenueSelectorProps = {
  user: User
  defaultVenue?: Venue
  setValue: UseFormSetValue<FormData>
}

export const VenueSelector: React.FC<VenueSelectorProps> = ({ user, defaultVenue, setValue }) => {
  const { toast } = useToast()
  const [isAddingOpen, setAddingOpen] = React.useState(false)
  const [venues, vLoading, vError] = useVenueCollection();
  const [pVenues, pvLoading, pvError] = usePrivateVenueCollection()
  const [venue, setVenue] = React.useState<Pick<Venue, 'name' | 'address' | 'maxParticipants'>>({
    name: defaultVenue?.name || '',
    address: defaultVenue?.address || '',
    maxParticipants: defaultVenue?.maxParticipants || 0,
  })
  const venueList = Object.values(pVenues || {}).concat(Object.values(venues || {}))
  const publicByUser = venueList.reduce((acc, v) => {
    if (v.createdBy.uid === user.uid) {
      return acc + 1
    }
    return acc
  }, 0)

  React.useEffect(() => {
    if (vError) {
      toast({
        title: 'Error',
        description: `${vError}`,
        variant: 'destructive',
      })
    }
  }, [vError])

  React.useEffect(() => {
    if (pvError) {
      toast({
        title: 'Error',
        description: `${pvError}`,
        variant: 'destructive',
      })
    }
  }, [pvError])

  const handleAddingChange = (open: boolean) => {
    setAddingOpen(open)
    if (!open) {
      // fix radix-ui bug not removing "pointer-events: none" when multiple stacks of portals open
      setTimeout(() => {
        document.body.removeAttribute('style')
      }, 200)
    }
  }

  return (
    <div>
      <Dialog open={isAddingOpen} onOpenChange={handleAddingChange}>
        <DialogContent>
          <AddVenue
            canAddPrivate={Object.values(pVenues || {}).length === 0}
            onSuccess={() => handleAddingChange(false)}
          />
        </DialogContent>
      </Dialog>
      <Select defaultValue={venue.name || undefined} onValueChange={(name) => {
        const match = venueList.find(v => v.name === name)
        if (match) {
          const venue = match
          setVenue(venue)
          setValue('venue', venue)
        }
      }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a venue">
            <div className="flex gap-2 items-center">
              <Icons.mapPin width={16} className="text-gray-500" />
              <span>{venue.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {(vLoading || pvLoading) && <p className="my-4">Loading available venues...</p>}
          </SelectGroup>
          <SelectGroup>
            {venueList.length > 0 && (
              <div className="pl-12 pr-6 flex gap-2 justify-end">
                <Icons.users width={12} />
              </div>
            )}
            {venueList.map((venue, i) => (
              <VenueSelectItem key={i} value={venue.name}>
                <div className="w-full my-2 flex gap-2 p-4">
                  <div className="w-full flex justify-between gap-8">
                    <div>
                      <p>{venue.name}</p>
                      <p>{venue.address}</p>
                    </div>
                    <div className="text-gray-500">
                      {venue.maxParticipants}
                    </div>
                  </div>
                </div>
              </VenueSelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <Button
              disabled={vLoading || pvLoading || publicByUser >= 4}
              variant="outline"
              onClick={() => setAddingOpen(true)}
            >
              Add new venue
            </Button>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
