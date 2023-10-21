/* eslint-disable max-len */
import {firestore, messaging} from "firebase-admin";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import {pushToUsers} from "./push";

export const eventCreate = (db: firestore.Firestore, messaging: messaging.Messaging) =>
  functions.region("europe-west1")
    .firestore.document("events/{spaceId}/events/{id}")
    .onCreate(async (snapshot, context) => {
      const data = snapshot.data();
      const space = await db.collection("spaces")
        .doc(context.params.spaceId).get();
      const spaceData = space.data();

      try {
        if (data.createdBy.email === data.venue.createdBy.email) {
          const userIds = data.private ? Object.keys(spaceData?.members || {}) : undefined;

          await pushToUsers({
            db,
            messaging,
            topic: "events",
            userIds: userIds,
            ignoreUserIds: [data.createdBy.uid],
            payload: {
              notification: {
                title: "New event posted",
                body: `${data.createdBy.name?.split(" ")[0]} is hosting a movie night! Want to join?`,
              },
            },
          });
        } else {
          await pushToUsers({
            db,
            messaging,
            topic: "events",
            userIds: [data.venue.createdBy.id],
            payload: {
              notification: {
                title: "Action required",
                body: `${data.createdBy.name?.split(" ")[0]} would like to host an event at ${data.venue.name}. Please review!`,
              },
            },
          });
        }
      } catch (err) {
        logger.error("[Push] Error", err);
      }
    });
