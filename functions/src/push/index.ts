import {messaging, firestore} from "firebase-admin";
import * as logger from "firebase-functions/logger";

type Topic = "events"

type Props = {
  db: firestore.Firestore,
  messaging: messaging.Messaging,
  topic: Topic,
  payload: messaging.MessagingPayload,
  userIds?: string[]
}

const getSnapshots = async ({
  db,
  topic,
  userIds,
}: Omit<Props, "payload" | "messaging">) => {
  if (userIds && userIds.length) {
    return db.collection("devices")
      .where("uid", "in", userIds)
      .where(topic, "!=", false)
      .get();
  }

  return db.collection("devices")
    .where(topic, "!=", false)
    .get();
};

export const pushToUsers = async ({
  db,
  messaging,
  topic,
  payload,
  userIds,
}: Props) => {
  const snapshots = await getSnapshots({db, topic, userIds});

  const tokens = snapshots.docs.map((d) => d.data().token);

  logger.log(`Found ${tokens.length} tokens`);
  logger.log(snapshots);

  if (tokens.length) {
    await messaging.sendEachForMulticast({
      tokens,
      ...payload,
    });
  }

  return;
};
