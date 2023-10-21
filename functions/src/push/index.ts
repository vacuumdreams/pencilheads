import {messaging, firestore} from "firebase-admin";
import * as logger from "firebase-functions/logger";

type Topic = "events"

type Props = {
  db: firestore.Firestore,
  messaging: messaging.Messaging,
  topic: Topic,
  payload: messaging.MessagingPayload,
  userIds?: string[]
  ignoreUserIds?: string[]
}

const getSnapshots = async ({
  db,
  topic,
  userIds,
  ignoreUserIds,
}: Omit<Props, "payload" | "messaging">) => {
  let q = db.collection("devices");

  if (userIds && userIds.length) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    q = q.where("uid", "in", userIds);
  }

  if (ignoreUserIds && ignoreUserIds.length) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    q = q.where("uid", "not-in", ignoreUserIds);
  }

  return q
    .where(topic, "!=", false)
    .get();
};

export const pushToUsers = async ({
  db,
  messaging,
  topic,
  payload,
  userIds,
  ignoreUserIds,
}: Props) => {
  const snapshots = await getSnapshots({db, topic, userIds, ignoreUserIds});

  const tokens = snapshots.docs.map((d) => d.data().token);

  logger.log(`Found ${tokens.length} device tokens`);

  if (tokens.length) {
    logger.log("Sending batch notifications...");
    await messaging.sendEachForMulticast({
      tokens,
      ...payload,
    });
  }

  return;
};
