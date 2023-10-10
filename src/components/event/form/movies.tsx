import React from 'react'
import { useFieldArray, Control } from 'react-hook-form'
import { MovieSearch } from './movie-search'
import { FormData } from './types'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

type MoviesProps = {
  control: Control<FormData>
}

export const Movies: React.FC<MoviesProps> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "movies",
  });

  return (
    <div className='pt-2'>
      <div className="flex flex-col gap-2">
        {fields.map((field, i) => (
          <div key={field.imdbId} className="flex gap-2 mb-2 items-center justify-between">
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
            <Button variant="ghost" onClick={() => remove(i)}>
              <Icons.close />
            </Button>
          </div>
        ))}
      </div>
      <MovieSearch disabled={fields.length <= 4} onSubmit={(movie) => append(movie)} />
    </div >
  )
}
