import {
  Avatar as UIAvatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { User } from '@/types'

const getName = (person: User) => {
  if (!person.name) {
    return person.email.split('@')[0]
  }
  return person.name
}

type AvatarProps = {
  person: User
  className?: string
  style?: React.CSSProperties
}

export const Avatar = ({ person, className, style }: AvatarProps) => {
  return (
    <UIAvatar
      style={style}
      className={className}
    >
      <AvatarImage src={person.photoUrl || undefined} alt={person.name} />
      <AvatarFallback>
        {getName(person).replace(/-/g, ' ').split(' ').slice(0, 2).map(c => c[0]).join('')}
      </AvatarFallback>
    </UIAvatar>
  )
}

type AvatarGroupProps = {
  maxDisplay: number
  className?: string
  people: User[]
}

export const AvatarGroup = ({ people, maxDisplay, className }: AvatarGroupProps) => {
  const others = people.slice(maxDisplay).length

  return (
    <div className={cn('flex items-center', className)}>
      {people.slice(0, maxDisplay).map((p, i) => (
        <Avatar
          key={i}
          person={p}
          style={{ zIndex: people.length - i }}
          className={cn('border-4', {
            '-ml-3': i > 0,
          })}
        />
      ))}
      <span>{others ? `+${others}` : null}</span>
    </div>
  )
}
