import { Event } from '@/types';
import { MovieItem } from '@/hooks/use-movie';

export type FormData = Event & {
  movies: MovieItem[]
}
