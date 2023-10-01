import { Event } from '@/types';
import { MovieItem } from '@/hooks/use-movie';

export type FormData = Event & {
  scheduledForTime: string
  movies: MovieItem[]
}
