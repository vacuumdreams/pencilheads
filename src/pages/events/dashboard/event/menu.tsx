import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'firebase/auth'
import { Icons } from '@/components/icons'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogHeader,
  DialogContent,
} from '@/components/ui/dialog'
import { Guests } from './guests'
import { Event } from '@/types'

type MenuProps = {
  now: Date
  schedule: Date
  user: User
  event: Event
}

export const Menu = ({ now, schedule, user, event }: MenuProps) => {
  const navigate = useNavigate()
  const [isGuestsDialogOpen, setGuestsDialogOpen] = React.useState(false)
  const currentParticipants = Object.keys(event.attendance || {}).length

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icons.ellipsis width={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={now > schedule && currentParticipants >= event.venue.maxParticipants}
            onClick={() => navigate(`/events/${event.id}`)}
          >
            <Icons.pencil width={12} />
            <span className="ml-4">Edit event</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={now > schedule && currentParticipants >= event.venue.maxParticipants}
            onClick={() => setGuestsDialogOpen(true)}
          >
            <Icons.invite width={12} />
            <span className="ml-4">Invite guests</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isGuestsDialogOpen} onOpenChange={setGuestsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-2xl font-bold">Invite guests</h2>
          </DialogHeader>
          <div>
            <Guests
              user={user}
              event={event}
              onClose={() => setGuestsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
