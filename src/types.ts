// Types.ts
export interface Food {
  name: string;
  description?: string;
}

export interface Venue {
  name: string;
  address: string;
  maxParticipants: number;
}

export interface Subscription {
  email: string;
  name: string;
  photoUrl?: string | null;
  guests: number;
}

export interface Movie {
  title: string,
  director: string,
  plot: string,
  year: string,
  poster: string,
  imdbId: string,
  imdbRating: string,
  votes: string[];
}

export interface Event {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  scheduledForDate: Date;
  scheduledForTime: string;
  expenses?: number;
  food?: null | Food;
  venue: Venue;
  subscriptions: Subscription[];
  movies: Movie[];
}
