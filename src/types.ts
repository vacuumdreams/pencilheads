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

export type DBVenue = Omit<Venue, 'createdAt' | 'updatedAt'> & {
  createdAt: number;
  updatedAt: number;
}

export type Guest = {
  name: string;
  email: string;
  invitedAt: number;
  confirmedAt: number | null;
  invitedBy: {
    name: string;
    email: string;
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
  actors: string,
  plot: string,
  year: string,
  awards?: string,
  poster: string,
  imdbId: string,
  imdbRating: string,
  trailer?: string,
  tags?: string[],
  votes: string[];
}

export interface Event {
  id: string
  name: string;
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
  subscriptions: Record<string, Subscription>;
  guests: Record<string, Guest[]>;
  movies: Movie[];
}

export type DBEvent = Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'scheduledForDate'> & {
  createdAt: number;
  updatedAt: number;
  scheduledForDate: number;
}

export type Invite = {
  email: string,
  accepted: boolean,
  acceptedAt: null | number,
  createdAt: number,
  createdBy: {
    name: string,
    email: string,
  },
}
