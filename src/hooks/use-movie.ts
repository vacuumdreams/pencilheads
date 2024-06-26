import React from 'react'
import { Movie } from '@/types'
import { useToast } from '@/components/ui/use-toast'

export type MovieItem = {
  title: string,
  year: string,
  poster: string,
  imdbId: string,
}

export function useMovieSearch() {
  const { toast } = useToast()
  const [results, setResults] = React.useState<MovieItem[]>([])
  const [loading, setLoading] = React.useState(false)

  const mutate = async (title: string) => {
    try {
      if (!import.meta.env.VITE_OMDB_API_KEY) {
        console.error(new Error('Missing OMDB API Key'))
        toast({
          title: 'Error',
          description: 'There was a problem collecting data about the movie. Please try again later.',
          variant: 'destructive',
        })
        return
      }
      const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`)
      const data = await response.json()

      if (data.Error === 'Too many results.') {
        toast({
          title: 'Warning',
          description: 'There are too many results for your search. Try to be more specific!',
        })
        return
      }

      if (data.Error) {
        toast({
          title: 'Warning',
          description: data.Error,
        })
        return
      }

      const res = data.Search?.map((item: any) => ({
        title: item.Title,
        year: item.Year,
        poster: item.Poster,
        imdbId: item.imdbID,
      })) || []

      setResults(res)
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'There was a problem collecting data about the movie. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return { results, mutate, loading, reset: () => setResults([]) }
}

type MiniDbResponse = {
  results: {
    imdb_id: string
    title: string
    year: number
    popularity: number
    description: string
    content_rating: string
    movie_length: number
    rating: number
    created_at: string
    trailer: string
    image_url: string
    release: string
    plot: string
    gen: Array<{ genre: string }>
  }
}

const getTrailerAndTags = async (id: string, toast: ReturnType<typeof useToast>['toast']) => {
  try {
    const res = await fetch(`https://moviesminidatabase.p.rapidapi.com/movie/id/${id}`, {
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
        'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST,
      }
    })
    const json = await res.json() as MiniDbResponse
    return {
      trailer: json.results.trailer,
      tags: json.results.gen.map(g => g.genre),
    }
  } catch (err) {
    toast({
      title: 'Error',
      description: `${err}`,
      variant: 'destructive',
    })
    return {
      trailer: undefined,
      tags: [] as string[],
    }
  }
}

const getMovieData = async (id: string) => {
  const response = await fetch(`https://www.omdbapi.com/?i=${encodeURIComponent(id)}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`)
  const json = await response.json()
  return {
    title: json.Title as string,
    director: json.Director as string,
    actors: json.Actors as string,
    awards: json.Awards as string,
    plot: json.Plot as string,
    year: json.Year as string,
    poster: json.Poster as string,
    imdbId: json.imdbID as string,
    imdbRating: json.imdbRating as string,
  }
}

export function useMovie() {
  const { toast } = useToast()
  const [results, setResults] = React.useState<Movie[]>([])
  const [loading, setLoading] = React.useState(false)

  const mutate = async (ids: string[]) => {
    try {
      if (!import.meta.env.VITE_OMDB_API_KEY) {
        throw new Error('Missing OMDB API Key')
      }

      const data = await Promise.all(ids.map(async id => {
        const [movie, { trailer, tags }] = await Promise.all([
          getMovieData(id),
          // @TODO: RAPIDAPI's down, replace it with something else later
          // getTrailerAndTags(id, toast),
          Promise.resolve({ trailer: '', tags: [] })
        ])

        return {
          ...movie,
          trailer,
          tags,
          votes: [],
        }
      }))
      setLoading(false)
      setResults(data)

      return data
    } catch (err) {
      setLoading(false)
      toast({
        title: 'Error',
        description: `${err}`,
        variant: 'destructive',
      })
      return []
    }
  }

  return { results, mutate, loading }
}
