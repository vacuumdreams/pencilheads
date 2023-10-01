import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type Person = {
  name: string
  email: string
  photoUrl?: string | null
}

type AvatarGroupProps = {
  maxDisplay: number
  className?: string
  people: Person[]
}

const getName = (person: Person) => {
  if (!person.name) {
    return person.email.split('@')[0]
  }
  return person.name
}

export const AvatarGroup = ({ people, maxDisplay, className }: AvatarGroupProps) => {
  const others = people.slice(maxDisplay).length

  return (
    <div className={cn('flex items-center', className)}>
      {people.slice(0, maxDisplay).map((p, i) => (
        <Avatar
          key={i}
          style={{ zIndex: people.length - i }}
          className={cn('border-4', {
            '-ml-3': i > 0,
          })}
        >
          <AvatarImage src={p.photoUrl || undefined} alt={p.name} />
          <AvatarFallback>
            {getName(p).replace(/-/g, ' ').split(' ').slice(0, 2).map(c => c[0]).join('')}
          </AvatarFallback>
        </Avatar>
      ))}
      <span>{others ? `+${others}` : null}</span>
    </div>
  )
}
