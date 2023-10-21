/* eslint-disable max-len */
import {firestore, messaging} from "firebase-admin";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import {pushToUsers} from "./push";

export const eventCreate = (db: firestore.Firestore, messaging: messaging.Messaging) =>
  functions.region("europe-west1")
    .firestore.document("events/{spaceId}/events/{id}")
    .onUpdate(async (snapshot, context) => {
      const beforeData = snapshot.before.data();
      const afterData = snapshot.before.data();

      if (!beforeData?.approvedByHost && afterData?.approvedByHost) {
        const space = await db.collection("spaces")
          .doc(context.params.spaceId).get();
        const spaceData = space.data();

        try {
          const userIds = context.params.spaceId === "PUBLIC" ? Object.keys(spaceData?.members || {}) : undefined;

          await pushToUsers({
            db,
            messaging,
            topic: "events",
            userIds: userIds,
            ignoreUserIds: [afterData.createdBy.uid, afterData.venue.createdBy.uid],
            payload: {
              notification: {
                title: "New event available",
                body: `${afterData.createdBy.name?.split(" ")[0]} is hosting a movie night! Want to join?`,
              },
            },
          });
        } catch (err) {
          logger.error("[Push] Error", err);
        }
      }
    });
