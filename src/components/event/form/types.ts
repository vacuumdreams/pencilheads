import { Event, Movie } from '@/types';
import { MovieItem } from '@/hooks/use-movie';

export type FormData = Omit<Event, 'movies'> & {
  scheduledForTime: string
  movies: Array<MovieItem | Movie>
}
