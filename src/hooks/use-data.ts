import React from "react"
import {
  doc,
  query,
  collection,
  getCountFromServer,
  DocumentData,
  QueryConstraint,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  FirestoreError,
} from "firebase/firestore"
import { auth, database } from "@/services/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection, useDocument } from "react-firebase-hooks/firestore"
import { useSpaceId } from "@/hooks/use-space"
import { getDbErrorMessage } from "@/lib/utils"
import { Invite, Space, Event, Venue } from "@/types"

const toInvite = (d: any): Invite => ({
  ...d,
  acceptedAt: d.acceptedAt?.toDate(),
  expiresAt: d.expiresAt.toDate(),
  createdAt: d.createdAt.toDate(),
})

const toSpace = (d: any): Space => ({
  ...d,
  createdAt: d.createdAt.toDate(),
})

const toEvent = (d: any): Event => ({
  ...d,
  createdAt: d.createdAt.toDate(),
  updatedAt: d.updatedAt.toDate(),
  scheduledFor: d.scheduledFor.toDate(),
  venue: toVenue(d.venue),
  guests: Object.keys(d.guests).reduce<Event["guests"]>(
    (acc, key) => ({
      ...acc,
      [key]: {
        ...d.guests[key],
        invitedAt: d.guests[key].invitedAt.toDate(),
        confirmedAt: d.guests[key].confirmedAt.toDate(),
      },
    }),
    {}
  ),
  attendance: Object.keys(d.attendance).reduce<Event["attendance"]>(
    (acc, key) => ({
      ...acc,
      [key]: {
        ...d.attendance[key],
        markedAt: d.attendance[key].markedAt.toDate(),
      },
    }),
    {}
  ),
})

const toVenue = (d: any): Venue => ({
  ...d,
  createdAt: d.createdAt.toDate(),
  updatedAt: d.updatedAt.toDate(),
})

function createConverter<T extends DocumentData>(toData: (d: any) => T) {
  return {
    toFirestore(space: WithFieldValue<T>): DocumentData {
      return space
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): T {
      const data = snapshot.data(options)
      return toData(data)
    },
  }
}

const spaceConverter = createConverter<Space>(toSpace)
const inviteConverter = createConverter<Invite>(toInvite)
const eventConverter = createConverter<Event>(toEvent)
const venueConverter = createConverter<Venue>(toVenue)

type HookParams = {
  filters?: QueryConstraint[]
}

export function useSpaceCollection(
  p?: HookParams
): [Record<string, Space> | undefined, boolean, string | null] {
  const [user] = useAuthState(auth)

  if (!user) throw new Error("Must be authorized to query spaces.")

  const ref = collection(database, "spaces").withConverter(spaceConverter)
  const [snapshots, loading, error] = useCollection(
    p?.filters ? query(ref, ...p.filters) : ref
  )
  const docs = snapshots?.docs.reduce<Record<string, Space>>(
    (acc, doc) => ({ ...acc, [doc.id]: doc.data() }),
    {}
  )
  return [docs, loading, getDbErrorMessage("spaces", error)]
}

export function useSpace(
  p?: HookParams & { id?: string }
): [Space | undefined, boolean, string | null] {
  const spaceId = useSpaceId()
  const [user] = useAuthState(auth)

  if (!p?.id && !spaceId) throw new Error("Must provide a space id.")
  if (!user) throw new Error("Must be authorized to query spaces.")

  const ref = doc(database, `spaces/${p?.id || spaceId}`).withConverter(
    spaceConverter
  )
  const [document, loading, error] = useDocument(ref)
  return [document?.data(), loading, getDbErrorMessage("this space", error)]
}

export function useEventCollection(
  p: HookParams & { spaceId: string }
): [Record<string, Event> | undefined, boolean, string | null] {
  const [user] = useAuthState(auth)

  if (p.spaceId !== "PUBLIC" && !user)
    throw new Error("Must be authorized to query events.")
  if (!p?.spaceId) throw new Error("Missing space id, cannot query events.")

  const ref = collection(database, `events/${p.spaceId}/events`).withConverter(
    eventConverter
  )
  const [snapshots, loading, error] = useCollection(
    p?.filters ? query(ref, ...p.filters) : ref
  )
  const docs = (snapshots?.docs || []).reduce<Record<string, Event>>(
    (acc, doc) => ({ ...acc, [doc.id]: doc.data() }),
    {}
  )
  return [docs, loading, getDbErrorMessage("events", error)]
}

export function useEventCount(
  p?: HookParams & { spaceId?: string }
): [number, boolean, string | null] {
  const [count, setCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<FirestoreError | undefined>(
    undefined
  )
  const spaceId = useSpaceId()
  const [user] = useAuthState(auth)

  if (!user) throw new Error("Must be authorized to query events.")
  if (!p?.spaceId && !spaceId)
    throw new Error("Missing space id, cannot query events.")

  const ref = collection(database, `events/${spaceId}/events`).withConverter(
    eventConverter
  )

  React.useEffect(() => {
    async function fetchCount() {
      setLoading(true)
      try {
        const snapshot = await getCountFromServer(
          p?.filters ? query(ref, ...p.filters) : ref
        )
        setLoading(false)
        console.log(snapshot.data())
        setCount(snapshot.data().count)
      } catch (err) {
        setError(err as FirestoreError)
        setLoading(false)
      }
    }

    fetchCount()
  }, [])

  return [count, loading, getDbErrorMessage("events", error)]
}

export function useEvent(
  p: HookParams & { id?: string }
): [Event | undefined, boolean, string | null] {
  const spaceId = useSpaceId()
  const [user] = useAuthState(auth)

  if (!p.id) throw new Error("Must provide an event id.")
  if (!user) throw new Error("Must be authorized to query events.")
  if (!spaceId) throw new Error("Missing space id, cannot query events.")

  const ref = doc(database, `events/${spaceId}/events/${p.id}`).withConverter(
    eventConverter
  )
  const [document, loading, error] = useDocument(ref)
  return [document?.data(), loading, getDbErrorMessage("events", error)]
}

export function usePrivateVenueCollection(
  p?: HookParams
): [Record<string, Venue> | undefined, boolean, string | null] {
  const spaceId = useSpaceId()
  const [user] = useAuthState(auth)

  if (!user) throw new Error("Must be authorized to query venues.")
  if (!spaceId) throw new Error("Missing space id, cannot query venues.")

  const venueNamespace = `users/${user.uid}/venues`
  const ref = collection(database, venueNamespace).withConverter(venueConverter)
  const [snapshots, loading, error] = useCollection(
    p?.filters ? query(ref, ...p.filters) : ref
  )
  const docs = (snapshots?.docs || []).reduce<Record<string, Venue>>(
    (acc, doc) => ({ ...acc, [doc.id]: doc.data() }),
    {}
  )
  return [docs, loading, getDbErrorMessage("venues", error)]
}

export function useVenueCollection(
  p?: HookParams
): [Record<string, Venue> | undefined, boolean, string | null] {
  const spaceId = useSpaceId()
  const [user] = useAuthState(auth)

  if (!user) throw new Error("Must be authorized to query venues.")
  if (!spaceId) throw new Error("Missing space id, cannot query venues.")

  const venueNamespace = `venues/${spaceId}/venues`
  const ref = collection(database, venueNamespace).withConverter(venueConverter)
  const [snapshots, loading, error] = useCollection(
    p?.filters ? query(ref, ...p.filters) : ref
  )
  const docs = (snapshots?.docs || []).reduce<Record<string, Venue>>(
    (acc, doc) => ({ ...acc, [doc.id]: doc.data() }),
    {}
  )
  return [docs, loading, getDbErrorMessage("venues", error)]
}

export function useInviteCollection(
  p?: HookParams
): [Record<string, Invite> | undefined, boolean, string | null] {
  const [user] = useAuthState(auth)

  if (!user) throw new Error("Must be authorized to query venues.")

  const ref = collection(database, `invites`).withConverter(inviteConverter)
  const [snapshots, loading, error] = useCollection(
    p?.filters ? query(ref, ...p.filters) : ref
  )
  const docs = (snapshots?.docs || []).reduce<Record<string, Invite>>(
    (acc, doc) => ({ ...acc, [doc.id]: doc.data() }),
    {}
  )
  return [docs, loading, getDbErrorMessage("invites", error)]
}
