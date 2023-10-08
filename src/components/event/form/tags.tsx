import React from "react"
import { useFieldArray, Control, Controller, UseFormRegister } from 'react-hook-form'
import { icons as lucides } from "lucide-react"
import { FixedSizeList } from 'react-window'

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

const icons = Object.keys(lucides).reduce<Option[]>((acc, key) => {
  // @ts-ignore too lazy to fix this
  const Icon = lucides[key]

  if (Icon && 'displayName' in Icon) {
    acc.push({
      label: <Icon width={16} />,
      value: key,
    })
  }
  return acc
}, [])

type ComboBoxItemRowProps = {
  index: number
  style?: React.HTMLAttributes<HTMLDivElement>['style']
}

const getComboBoxItemRow = (currentValue: string, onSelect: (value: string) => void) => ({ index, style }: ComboBoxItemRowProps) => {
  const element = icons[index]

  return (
    <CommandItem
      key={element.value}
      style={{
        ...style,
      }}
      className={cn('cursor-pointer flex justify-start items-center gap-2', {
        'bg-green-700 hover:bg-green-700': currentValue?.toLowerCase() === element.value.toLowerCase(),
      })}
      onSelect={onSelect}
    >
      <span>{element.label}</span>
      <span>{element.value}</span>
    </CommandItem>
  );
}

export function Combobox({ onChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  const activeItem = React.useMemo(() => {
    return icons.find((icons) => icons.value.toLowerCase() === value.toLowerCase())
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100px] justify-between"
        >
          <span>
            {activeItem?.label || "Icon"}
          </span>
          <Icons.chevronUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command onSelect={onChange}>
          <CommandInput placeholder="Search icons..." />
          <CommandEmpty>No icons found.</CommandEmpty>
          <CommandGroup>
            <FixedSizeList
              height={400}
              width={200}
              itemCount={icons.length}
              itemSize={50}
            >
              {getComboBoxItemRow(value, (newValue) => {
                setValue(newValue)
                setOpen(false)
              })}
            </FixedSizeList>
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
      <div className="flex gap-2 my-4">
        {fields.map((f, i) => (
          <div key={f.id} className="w-full flex gap-2">
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
              className="grow"
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
