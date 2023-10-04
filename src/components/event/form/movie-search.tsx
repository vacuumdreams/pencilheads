import React from 'react'
import { useMovieSearch, MovieItem } from '@/hooks/use-movie'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'

type MovieSearchProps = {
  disabled: boolean
  onSubmit: (movie: MovieItem) => void
}

export const MovieSearch: React.FC<MovieSearchProps> = ({ disabled, onSubmit }) => {
  const [isOpen, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const { results, mutate, loading, reset } = useMovieSearch()

  const handleSubmit = async (movie: MovieItem) => {
    setTitle('')
    reset()
    onSubmit(movie)
  }

  React.useEffect(() => {
    setOpen(results.length > 0)
  }, [results])

  return (
    <div className="">
      <DropdownMenu open={isOpen} onOpenChange={setOpen} modal>
        {disabled !== false && (
          <div className='w-full'>
            <div className='flex gap-2'>
              <Input
                placeholder='Search for a movie'
                disabled={loading}
                value={title}
                onChange={(e) => {
                  e.stopPropagation()
                  setTitle(e.target.value)
                }}
              />
              <Button onClick={(e) => {
                e.preventDefault()
                title && mutate(title)
              }}>
                <Icons.search width={12} />
              </Button>
            </div>
          </div>
        )}
        <DropdownMenuTrigger className='w-full' />
        <DropdownMenuContent className='w-[calc(100%_-_2rem) left-[1rem]'>
          {results.map((movie, i) => (
            <DropdownMenuItem key={i} onClick={() => handleSubmit(movie)}>
              <div className='w-full flex items-center gap-2'>
                <div className="w-8 h-8 overflow-hidden">
                  <img className="object-cover" src={movie.poster} />
                </div>
                <div className='flex-1 w-full flex gap-2 justify-between items-center' >
                  <div>{movie.title}{' '}</div>
                  <DropdownMenuShortcut>{movie.year}</DropdownMenuShortcut>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
