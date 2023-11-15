import { Avatar } from "@/components/avatar-group"
import { Tag } from "@/components/ui/tag"
import { Event } from "@/types"

type AttendeesListProps = {
  event: Event
}

export const AttendeesList = ({ event }: AttendeesListProps) => {
  const keys = Object.keys(event.attendance || {})
  return (
    <div className="pt-4">
      {keys.map((key) => (
        <div key={key} className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar person={event.attendance[key]} />
            <span>{event.attendance[key].name}</span>
          </div>
          <div>
            {event.venue.hosts?.includes(key) && <Tag>host</Tag>}
            {event.createdBy.uid === key && <Tag>organiser</Tag>}
          </div>
        </div>
      ))}
    </div>
  )
}
