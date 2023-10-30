import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'firebase/auth'
import { where, deleteField } from 'firebase/firestore'
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContent,
} from '@/components/ui/dialog'
import { AvatarGroup } from '@/components/avatar-group'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { Counter } from '@/components/counter'
import { Space } from '@/types'
import { cn } from '@/lib/utils'
import { useEventCount } from '@/hooks/use-data'
import { useMutate } from '@/hooks/use-mutate'
import { useToast } from '@/components/ui/use-toast'

type SpaceCardProps = {
  user: User
  id: string
  space: Space
  className?: string
}

export const SpaceCard = ({ user, id, space, className }: SpaceCardProps) => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLeaveDialogOpen, setLeaveDialogOpen] = React.useState(false)
  const { update, loading } = useMutate('group')
  const members = Object.values(space.members || {})
  const [count, _loading, error] = useEventCount({
    spaceId: id,
    filters: [where('scheduledFor', '>=', new Date())]
  })

  React.useEffect(() => {
    if (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: `${error}`,
        variant: 'destructive',
      })
    }
  }, [error])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <Tag
            className={cn('dark:text-white', {
              'bg-green-300 dark:bg-green-500': space.subscription,
              'bg-gray-300 dark:bg-gray-700': !space.subscription,
            })}
          >
            {space.subscription ? 'Active' : 'Inactive'}
          </Tag>
          <span>{space.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex gap-2 justify-between">
          <p>{members.length} {members.length === 1 ? 'member' : 'members'}</p>
          <AvatarGroup
            maxDisplay={3}
            people={members}
          />
        </div>
        <CardDescription className={cn('')}>
          <Counter from={0} to={count} timeout={800} /> upcoming {count === 1 ? 'event' : 'events'}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex gap-2" onClick={() => navigate(`/dashboard/spaces/${id}`)}>
          <Icons.arrowUpRightSquare />
          <span>Open</span>
        </Button>
        <Button
          disabled={loading}
          className="flex gap-2"
          variant="outline"
          onClick={() => {
            setLeaveDialogOpen(true)
          }}
        >
          <Icons.unplug />
          <span>Leave group</span>
        </Button>
      </CardFooter>

      <Dialog open={isLeaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave group</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p>Are you sure you want to leave {space.name}?</p>
          </DialogDescription>
          <DialogFooter>
            <Button
              disabled={loading}
              variant="destructive"
              onClick={() => {
                setLeaveDialogOpen(false)
                update(`spaces/${id}`, {
                  [`members.${user.uid}`]: deleteField(),
                })
              }}
            >
              Yes, leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
