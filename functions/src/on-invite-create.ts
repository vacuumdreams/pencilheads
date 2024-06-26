import {firestore} from "firebase-admin";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import Mailgun from "mailgun.js";
import formData from "form-data";

const mailgun = new Mailgun(formData);

const MAILGUN_DOMAIN = functions.config().mailgun.domain;
const MAILGUN_API_KEY = functions.config().mailgun.key;

// Initialize Mailgun
const mg = mailgun.client({
  username: "api",
  url: "https://api.eu.mailgun.net",
  key: MAILGUN_API_KEY,
});

export const inviteCreate = (db: firestore.Firestore) =>
  functions.region("europe-west1").firestore.document("invites/{id}")
    .onCreate(async (snapshot, context) => {
      const data = snapshot.data();

      if (!data) {
        logger.error("Data not found for document:", context.params.id);
        return;
      }

      const space = await db.collection("spaces").doc(data.spaceId).get();
      const spaceData = space.data();
      const spaceName = spaceData?.name;
      const telegramInviteLink = spaceData?.telegramInviteLink;

      // Email details
      const mailOptions = {
        "from": "Pencilheads <info@pencilheads.net>",
        "to": data.email,
        "subject": `You have been invited to join ${spaceName}!`,
        "template": telegramInviteLink ?
          "space-invite-telegram" :
          "space-invite",
        "h:X-Mailgun-Variables": JSON.stringify({
          person: data.createdBy.name,
          space: spaceName,
          inviteToken: context.params.id,
          telegramInviteLink,
        }),
      };

      // Send the email using Mailgun
      try {
        await mg.messages.create(MAILGUN_DOMAIN, mailOptions);
        logger.log("Email sent to:", data.email);
      } catch (error) {
        logger.error("There was an error while sending the email:", error);
      }
    });
