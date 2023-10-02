// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
// import * as logger from "firebase-functions/logger";
// // @ts-ignore
// import Mailgun from "mailgun-js";
// import * as formData from "form-data";

// admin.initializeApp();
// const db = admin.database();

// const mailgun = new Mailgun(formData);

// const MAILGUN_DOMAIN = functions.config().mailgun.domain;
// const MAILGUN_API_KEY = functions.config().mailgun.key;

// // Initialize Mailgun
// const mg = mailgun.client({
//   user: "api",
//   key: MAILGUN_API_KEY,
// });

// export const onEventCreation = functions.database.ref("events/{id}")
//   .onCreate((snapshot) => {
//     const data = snapshot.val();

//     // TODO: send email to all members (invites/accepted=true)
//     // db.ref('invites').on('value', snapshots => {
//     //   const invites = snapshots.val().map(child => child.val())
//     // })

//     const members: string[] = [];

//     // Email details
//     const createMailOptions = {
//       "from": "Pencilheads <info@pencilheads.net>",
//       "to": data.email,
//       "subject": `${data.createdBy.name} has created a new event!`,
//       "template": "Event",
//       "h:X-Mailgun-Variables": JSON.stringify({
//         person: data.createdBy.name,
//         inviteToken: snapshot.key,
//       }),
//     };

//     // Email details
//     const inviteMailOptions = {
//       "from": "Pencilheads <info@pencilheads.net>",
//       "to": members.join(","),
//       "subject": `${data.createdBy.name} has created a new event!`,
//       "template": "Event",
//       "h:X-Mailgun-Variables": JSON.stringify({
//         person: data.createdBy.name,
//         inviteToken: snapshot.key,
//       }),
//     };

//     // Send the email using Mailgun
//     return Promise.all([
//       mg.messages.create(MAILGUN_DOMAIN, createMailOptions)
//         .then(() => {
//           logger.log("Event creation email sent to:", data.email);
//         })
//         .catch((error: any) => {
//           logger.error("There was an error while sending the email:", error);
//         }),
//       async () => {
//         if (members.length > 0) {
//           return mg.messages.create(MAILGUN_DOMAIN, inviteMailOptions)
//             .then(() => {
//               logger.log("Event invite email sent to:", members.join(","));
//             })
//             .catch((error: any) => {
//               logger.error(
//                "There was an error while sending the email:",
//                error
//              );
//             });
//         }
//       },
//     ]);
//   });
