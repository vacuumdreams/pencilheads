import React from 'react'
import { useFieldArray, Control } from 'react-hook-form'
import { MovieSearch } from './movie-search'
import { FormData } from './types'

type MoviesProps = {
  control: Control<FormData>
}

export const Movies: React.FC<MoviesProps> = ({ control }) => {
  const { fields, append } = useFieldArray({
    control,
    name: "movies",
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
