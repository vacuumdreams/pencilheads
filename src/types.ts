export type User = {
  uid: string;
  name: string;
  email: string;
  photoUrl?: string | null;
}

export type Venue = {
  name: string;
  public: boolean;
  city: string;
  address: string;
  maxParticipants: number;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export type Guest = {
  name: string;
  email: string;
  invitedAt: Date;
  confirmedAt: Date | null;
  invitedBy: User
}

export type Attendance = User & {
  markedAt: Date;
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
  type: 'movie-vote';
  description?: string;
  createdAt: Date;
  createdBy: User;
  approvedByHost: boolean;
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
  createdBy: User;
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

export type Member = User & {
  role: 'admin' | 'member';
}

export type Space = {
  name: string;
  createdAt: Date;
  createdBy: User;
  members: Record<string, Member>
  telegramInviteLink?: string;
  telegramGroupId?: string;
  subscription?: null | SpaceSubscription
}

export type Device = {
  uid: string;
  token: string;
  events: boolean;
  updatedAt: Date;
}
