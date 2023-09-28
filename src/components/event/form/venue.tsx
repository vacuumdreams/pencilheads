import React from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useList } from 'react-firebase-hooks/database';
import { ref, DataSnapshot } from 'firebase/database';
import { realtimeDB } from '@/services/firebase';
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
  defaultVenue?: Venue
  setValue: UseFormSetValue<FormData>
}

type VenueAcc = {
  keys: string[]
  venues: Venue[]
}

const getVenues = (snapshots?: DataSnapshot[]) => {
  const results = snapshots?.reduce<VenueAcc>((acc, v) => {
    const venue = v.val()
    const key = v.key
    if (key && !acc.keys.includes(key)) {
      acc.keys.push(key)
      acc.venues.push(venue)
    }
    return acc
  }, { keys: [], venues: [] }) || { keys: [], venues: [] }

  return results.venues
}

export const VenueSelector: React.FC<VenueSelectorProps> = ({ defaultVenue, setValue }) => {
  const { toast } = useToast()
  const [isAddingOpen, setAddingOpen] = React.useState(false)
  const [snapshots, loading, error] = useList(ref(realtimeDB, 'venues'));
  const [venue, setVenue] = React.useState<Pick<Venue, 'name' | 'address' | 'maxParticipants'>>({
    name: defaultVenue?.name || '',
    address: defaultVenue?.address || '',
    maxParticipants: defaultVenue?.maxParticipants || 0,
  })

  React.useEffect(() => {
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
      <Dialog open={isAddingOpen} onOpenChange={setAddingOpen}>
        <DialogContent>
          <AddVenue onSuccess={() => setAddingOpen(false)} />
        </DialogContent>
      </Dialog>
      <Select defaultValue={venue.name} onValueChange={(name) => {
        const match = snapshots?.find(v => v.val().name === name)
        if (match) {
          setVenue(match.val())
          setValue('venue', match.val())
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
            {loading && <p className="my-4">Loading available venues...</p>}
          </SelectGroup>
          <SelectGroup>
            {snapshots?.length !== undefined && snapshots.length > 0 && (
              <div className="pl-12 pr-6 flex gap-2 justify-end">
                <Icons.users width={12} />
              </div>
            )}
            {getVenues(snapshots).map((venue, i) => (
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
            <Button disabled={loading} variant="outline" onClick={() => setAddingOpen(true)}>
              Add new venue
            </Button>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
