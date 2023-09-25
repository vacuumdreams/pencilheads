import React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'

export const VenueSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm my-2 py-1.5 pl-6 pr-2 text-sm outline-none transition-colors bg-green-100 focus:bg-green-200 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>*:nth-child(2)]:w-full",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icons.mapPin width={32} />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
})
VenueSelectItem.displayName = "VenueSelectItem"
