// Types.ts
export interface Food {
  name: string;
  description?: string;
}

export interface Venue {
  name: string;
  address: string;
  maxParticipants: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DBVenue = Venue & {
  createdAt: number;
  updatedAt: number;
}

export type Guest = {
  name: string;
  email: string;
  invitedAt: number;
  confirmedAt: number | null;
  invitedBy: {
    email: string;
    name: string;
    photoUrl?: string | null;
  }
}

export interface Subscription {
  email: string;
  name: string;
  subscribedAt: number;
  photoUrl?: string | null;
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
  createdBy: {
    email: string;
    name: string;
    photoUrl?: string | null;
  };
  updatedAt: Date;
  scheduledForDate: Date;
  scheduledForTime: string;
  expenses?: number;
  food?: null | Food;
  venue: Venue;
  subscriptions: Subscription[];
  guests: Guest[];
  movies: Movie[];
}

export type DBEvent = Omit<Event, 'createdAt' | 'updatedAt' | 'scheduledForDate'> & {
  createdAt: number;
  updatedAt: number;
  scheduledForDate: string;
}
