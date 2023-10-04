import React from "react"
import { useFieldArray, Control, Controller, UseFormRegister } from 'react-hook-form'
import { icons as lucides } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

type Option = {
  label: React.ReactNode
  value: string
}

console.log(lucides)

const icons = Object.keys(lucides).reduce<Option[]>((acc, key) => {
  // @ts-ignore too lazy to fix this
  const Icon = Icons[key]

  if (Icon && 'displayName' in Icon) {
    acc.push({
      label: (<span><Icon width={16} /> {key}</span>),
      value: key,
    })
  }
  return acc
}, [])

console.log(icons)

export function Combobox({ onChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

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
            : "Select icon..."}
          <Icons.chevronUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                  setValue(currentValue === value ? '' : currentValue)
                  setOpen(false)
                }}
              >
                <Icons.check
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

type TagsProps = {
  register: UseFormRegister<FormData>
  control: Control<FormData>
}

export const Tags = ({ register, control }: TagsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });

  return (
    <div className='py-4'>
      <Button
        onClick={(e) => {
          e.preventDefault()
          append({ name: '', icon: '' })
        }}
      >
        Add tag
      </Button>
      <div className="flex flex-col gap-2 my-4">
        {fields.map((f, i) => (
          <div key={f.id} className="flex gap-2">
            <div>
              <Controller
                name={`tags.${i}.icon`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Combobox onChange={field.onChange} />
                )}
              />
            </div>
            <Input
              {...register(`tags.${i}.name`, { required: true })}
              placeholder="E.g. vegan hotdogs, or birthday party, etc."
            />
            <Button variant="ghost" onClick={() => remove(i)}>
              <Icons.close />
            </Button>
          </div>
        ))}
      </div>
    </div >
  )
}
