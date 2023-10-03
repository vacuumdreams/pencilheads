import {firestore, auth} from "firebase-admin";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";

export const inviteUpdate = (auth: auth.Auth, db: firestore.Firestore) =>
  functions.region("europe-west1").firestore.document("invites/{id}")
    .onUpdate(async (snapshot, context) => {
      const oldData = snapshot.before.data();
      const newData = snapshot.after.data();

      if (!newData) {
        logger.error("Data not found for document:", context.params.id);
        return;
      }

      if (oldData?.accepted === newData.accepted) {
        return;
      }

      if (!newData.userId) {
        logger.error("No user id on the invite:", context.params.id);
        return;
      }

      const user = await auth.getUser(newData.userId);

      if (!user) {
        logger.error("User cannot be found id for invite:", context.params.id);
        return;
      }

      if (!oldData?.accepted && newData.accepted) {
        const member = {
          role: "member",
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
        };

        try {
          await db.collection("spaces").doc(newData.spaceId).update({
            [`members.${newData.userId}`]: member,
          });
          await db.collection("invites").doc(context.params.id).delete();
        } catch (error) {
          logger.error(
            "Error updating space memberships for invite:",
            context.params.id,
            error
          );
        }
      }
    });
