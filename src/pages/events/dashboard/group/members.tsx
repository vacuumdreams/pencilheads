import { Tag } from '@/components/ui/tag'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/avatar-group'
import { Space, Member } from '@/types'

const sortByAdmin = (members: Record<string, Member>) => (m1: string, m2: string) => {
  if (members[m1].role === 'admin') {
    return -1
  }
  if (members[m2].role === 'admin') {
    return 1
  }
  return 0
}

type GroupMembersProps = {
  isAdmin: boolean
  space: Space
}

export const GroupMembers = ({ space, isAdmin }: GroupMembersProps) => {
  const memberIds = Object.keys(space.members).sort(sortByAdmin(space.members))

  return (
    <div>
      {memberIds.map((key) => (
        <div className="flex justify-between items-center mb-4">
          <div key={key} className="flex gap-2 items-center">
            <Avatar person={space.members[key]} />
            <span>{space.members[key].name}</span>
          </div>
          {space.members[key].role === 'admin' && (
            <Tag>
              ADMIN
            </Tag>
          )}
          {!isAdmin && space.members[key].role !== 'admin' && (
            <Tag>
              MEMBER
            </Tag>
          )}
          {isAdmin && space.members[key].role !== 'admin' && (
            <Button variant="outline">
              Make admin
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
