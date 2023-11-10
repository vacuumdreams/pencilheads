import { Icons } from "@/components/icons"
import { Event } from "@/types"
import { cn } from "@/lib/utils"

export const Directions = ({ event }) => {
  return (
    <a
      rel="noreferrer noopener"
      target="_blank"
      href={`https://www.google.com/maps/dir//${encodeURIComponent(
        event.venue.address
      )}`}
      className={cn(
        "-mx-4 mb-4 w-[calc(100%_+_2rem)] px-4 pb-2 pt-4 sm:bg-transparent",
        "flex flex-col items-start justify-start gap-2 sm:flex-row sm:justify-between"
      )}
    >
      <div className="flex items-center justify-start gap-2 sm:justify-between">
        <Icons.mapPin width={16} />
        <p>{event.venue.name}</p>
      </div>
      <span className="text-muted-foreground flex gap-2">
        <span>Get directions</span>
        <Icons.arrowUpRightSquare />
      </span>
    </a>
  )
}
