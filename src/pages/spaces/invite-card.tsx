import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AvatarGroup } from '@/components/avatar-group'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { Space, Invite } from '@/types'
import { cn } from '@/lib/utils'

type SpaceCardProps = {
  inviteId: string
  space: Space
  invite: Invite
  className?: string
}

export const InviteCard = ({ inviteId, className, invite, space }: SpaceCardProps) => {
  const navigate = useNavigate()

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
        <div className="w-full flex gap-2 justify-start items-center">
          <AvatarGroup
            maxDisplay={1}
            people={[invite.createdBy]}
          />
          {invite.createdBy.name} invited you to join.
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex gap-2" onClick={() => navigate(`/invites/${inviteId}`)}>
          <Icons.userPlus />
          <span>Accept invitation</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
