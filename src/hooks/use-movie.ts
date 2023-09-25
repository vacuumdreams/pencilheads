import React from 'react'
import { Movie } from '@/types'

export type MovieItem = {
  title: string,
  year: string,
  poster: string,
  imdbId: string,
}

export function useMovieSearch() {
  const [results, setResults] = React.useState<MovieItem[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<null | string>(null)

  const mutate = async (title: string) => {
    try {
      if (!import.meta.env.VITE_OMDB_API_KEY) {
        throw new Error('Missing OMDB API Key')
      }
      const response = await fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`)
      const data = await response.json()
      const res = data.Search?.map((item: any) => ({
        title: item.Title,
        year: item.Year,
        poster: item.Poster,
        imdbId: item.imdbID,
      }))

      setResults(res)
    } catch (err) {
      setError(`${err}`)
    } finally {
      setLoading(false)
    }
  }

  return { results, mutate, loading, error, reset: () => setResults([]) }
}

export function useMovie() {
  const [results, setResults] = React.useState<Movie[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<null | string>(null)

  const mutate = async (ids: string[]) => {
    try {
      if (!import.meta.env.VITE_OMDB_API_KEY) {
        throw new Error('Missing OMDB API Key')
      }

      const data = await Promise.all(ids.map(async id => {
        const response = await fetch(`http://www.omdbapi.com/?i=${encodeURIComponent(id)}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`)
        const json = await response.json()
        return {
          title: json.Title,
          director: json.Director,
          plot: json.Plot,
          year: json.Year,
          poster: json.Poster,
          imdbId: json.imdbID,
          imdbRating: json.imdbRating,
          votes: [],
        }
      }))
      setLoading(false)
      setResults(data)

      return data
    } catch (err) {
      setLoading(false)
      setError(`${err}`)
      return []
    }
  }

  return { results, mutate, loading, error }
}
