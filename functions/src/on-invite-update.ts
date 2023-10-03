import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

export const onInviteUpdate = functions.firestore.document("invites/{id}")
  .onUpdate(async (snapshot, context) => {
    const oldData = snapshot.before.data();
    const newData = snapshot.after.data();

    if (!newData) {
      logger.error("Data not found for document:", context.params.id);
      return;
    }

    if (oldData?.accepted === newData.accepted) {
      return
    }

    if (!newData.userId) {
      logger.error("No user id on the invite:", context.params.id);
      return
    }

    const user = await auth.getUser(newData.userId);

    if (!user) {
      logger.error("User cannot be found id for invite:", context.params.id);
      return
    }

    if (!oldData?.accepted && newData.accepted) {
      const member = {
        role: 'member',
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
      }

      try {
        await db.collection(`spaces`).doc(newData.spaceId).set({
          [`members.${newData.userId}`]: member,
        }, { merge: true });
      } catch (error) {
        logger.error("Error updating space memberships for invite:", context.params.id);
      }
    }
  });
