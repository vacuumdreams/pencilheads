import React from "react"
import { cn } from "@/lib/utils"

type TagProps = {
  className?: string
  children: React.ReactNode
}

export const Tag = ({ className, children }: TagProps) => {
  return (
    <span className={cn('inline-block font-mono tracking-widest uppercase text-sm bg-gray-200 px-3 py-1 font-semibold text-gray-700 mr-2', className)}>
      {children}
    </span>
  )
}
