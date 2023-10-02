import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import Mailgun from "mailgun.js";
import formData from "form-data";

admin.initializeApp();
const db = admin.firestore();

const mailgun = new Mailgun(formData);

const MAILGUN_DOMAIN = functions.config().mailgun.domain;
const MAILGUN_API_KEY = functions.config().mailgun.key;

// Initialize Mailgun
const mg = mailgun.client({
  username: "api",
  key: MAILGUN_API_KEY,
});

export const onInviteCreate = functions.firestore.document("invites/{id}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();

    if (!data) {
      logger.error("Data not found for document:", context.params.id);
      return;
    }

    const space = await db.collection("spaces").doc(data.spaceId).get();
    const spaceName = space.data()?.name;

    // Email details
    const mailOptions = {
      "from": "Pencilheads <info@pencilheads.net>",
      "to": data.email,
      "subject": `You have been invited to join ${spaceName}!`,
      "template": "Invitation",
      "h:X-Mailgun-Variables": JSON.stringify({
        person: data.createdBy.name,
        space: spaceName,
        inviteToken: context.params.id,
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
