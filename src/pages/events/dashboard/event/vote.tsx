import { User } from 'firebase/auth'
import { deleteField } from 'firebase/firestore'
import { useMutate } from '@/hooks/use-mutate'
import { useSpaceId } from '@/hooks/use-space'
import { Icons } from '@/components/icons'
import { Toggle } from '@/components/ui/toggle'
import { Event } from '@/types'

type VoteButtonProps = {
  user: User
  eventId: String
  event: Event
  movieKey: string
  hasJoined: boolean
}

export const VoteButton = ({ user, eventId, event, movieKey, hasJoined }: VoteButtonProps) => {
  const spaceId = useSpaceId()
  const { update, loading } = useMutate()
  const hasVotedFor = event.votes[user.uid] === movieKey

  return (
    <Toggle
      pressed={hasVotedFor}
      variant="outline"
      disabled={!hasJoined || loading}
      onPressedChange={() => {
        if (hasVotedFor) {
          update(`events/${spaceId}/events/${eventId}`, {
            [`votes.${user.uid}`]: deleteField(),
          })
        } else {
          update(`events/${spaceId}/events/${eventId}`, {
            [`votes.${user.uid}`]: movieKey,
          })
        }
      }}
    >
      <Icons.thumbsUp />
    </Toggle>
  )
}
