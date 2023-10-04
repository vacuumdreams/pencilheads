export type Venue = {
  name: string;
  address: string;
  maxParticipants: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Guest = {
  name: string;
  email: string;
  invitedAt: Date;
  confirmedAt: Date | null;
  invitedBy: {
    name: string;
    email: string;
  }
}

export type Attendance = {
  email: string;
  name: string;
  markedAt: Date;
  photoUrl?: string | null;
}

export type Movie = {
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
  tags: string[],
}

export type Event = {
  name: string;
  createdAt: Date;
  createdBy: {
    email: string;
    name: string;
    photoUrl?: string | null;
  };
  updatedAt: Date;
  scheduledFor: Date;
  expenses?: number;
  tags: Array<{
    name: string;
    icon: string;
  }>;
  venue: Venue;
  attendance: Record<string, Attendance>;
  guests: Record<string, Guest[]>;
  movies: Record<string, Movie>;
  votes: Record<string, string>;
}

export type Invite = {
  userId?: string
  email: string,
  spaceId: string,
  accepted: boolean,
  acceptedAt: null | number,
  expiresAt: Date,
  createdAt: Date,
  createdBy: {
    name: string,
    email: string,
  },
}

export type Plan = {
  name: string
  maxMembers: number
  maxEventsPerMonth: number
}

export type SpaceSubscription = {
  plan: Plan
  active: boolean
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

export type Member = {
  role: 'admin' | 'member';
  name: string;
  email: string;
  photoUrl?: string | null;
}

export type Space = {
  name: string;
  createdAt: Date;
  createdBy: string;
  members: Record<string, Member>
  telegramInviteLink?: string;
  telegramGroupId?: string;
  subscription?: null | SpaceSubscription
}
