import { messaging, firestore } from "firebase-admin";

type Topic = 'event'

type Props = {
  db: firestore.Firestore,
  topic: Topic,
  payload: messaging.MessagingPayload,
  userIds?: string[]
}

const getSnapshots = async ({ db, topic, userIds }: Omit<Props, 'payload'>) => {
  if (userIds && userIds.length) {
    return db.collection('devices')
      .where('uid', 'in', userIds)
      .where(topic, '!=', false)
      .get()
  }

  return db.collection('devices')
    .where(topic, '!=', false)
    .get()
}

export const pushToUsers = async ({ db, topic, payload, userIds }: Props) => {
  const snapshots = await getSnapshots({ db, topic, userIds })

  const tokens = snapshots.docs.map((d) => d.data().token)

  if (tokens.length) {
    await messaging().sendEachForMulticast({
      tokens,
      ...payload,
    });
  }

  return
}
