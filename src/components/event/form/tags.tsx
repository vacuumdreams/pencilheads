import React from "react"
import { useFieldArray, Control } from 'react-hook-form'
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from '@/components/icons'
import { FormData } from "./types"

type ComboboxProps = {
  onChange: () => void
}

const icons = Object.keys(Icons).reduce((acc, key) => {
  const Icon = Icons[key]
  acc.push({
    label: (<span><Icon /> {key}</span>),
    value: key,
  })
  return acc
}, [])

export function Combobox({ onChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? icons.find((icons) => icons.value === value)?.label
            : "Select icons..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command onSelect={onChange}>
          <CommandInput placeholder="Search icons..." />
          <CommandEmpty>No icons found.</CommandEmpty>
          <CommandGroup>
            {icons.map((icons) => (
              <CommandItem
                key={icons.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === icons.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {icons.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

type ExtrasProps = {
  control: Control<FormData>
}

export const Extras = ({ control }: ExtrasProps) => {
  const { fields, append } = useFieldArray({
    control,
    name: "tags",
  });

  return (
    <div className='py-4'>
      <div className="flex flex-col gap-2 my-4">
        {fields.map(field => (
          <div key={field.imdbId} className="flex gap-2 items-center">
            <div className="w-16 h-16 overflow-hidden">
              <img
                className="object-cover"
                src={field.poster}
              />
            </div>
            <div className="">
              <p>{field.title} ({field.year})</p>
            </div>
          </div>
        ))}
      </div>
      <MovieSearch disabled={fields.length <= 4} onSubmit={(movie) => append(movie)} />
    </div >
  )
}
