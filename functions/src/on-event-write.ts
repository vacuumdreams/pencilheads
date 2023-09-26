import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as logger from "firebase-functions/logger";
// @ts-ignore
import Mailgun from 'mailgun-js';
import * as formData from 'form-data';

admin.initializeApp();

const mailgun = new Mailgun(formData);

const MAILGUN_DOMAIN = functions.config().mailgun.domain;
const MAILGUN_API_KEY = functions.config().mailgun.key;

// Initialize Mailgun
const mg = mailgun.client({
  user: 'api',
  key: MAILGUN_API_KEY,
});

const getGuests = (acc, sub) => {
  return [
    ...acc,
    sub.guests.map(guest => ({
      ...guest,
      invitedBy: {
        email: sub.email,
        name: sub.name,
        photoUrl: sub.photoUrl,
      },
    })),
  ]
}

const getNewInvitees = (prevData, data) => {
  const prevGuests = prevData.subscriptions.reduce(getGuests, [])
  const allGuests = data.subscriptions.reduce(getGuests, [])

  return allGuests.filter(guest => {
    return !prevGuests.find(prevGuest => prevGuest.email === guest.email)
  })
}

export const sendInviteEmail = functions.database.ref('events/{id}')
  .onWrite((snapshot) => {
    const prevData = snapshot.before.val()
    const data = snapshot.after.val()

    const newInvitees = getNewInvitees(prevData, data)

    if (newInvitees.length > 0) {
      newInvitees.forEach(invitee => {
        // Email details
        const mailOptions = {
          from: 'info@pencilheads.net',
          to: invitee.email,
          subject: `${invitee.invitedBy.name} has invited you to an event!`,
          template: 'Event invite',
          'h:X-Mailgun-Variables': JSON.stringify({
            invitee,
            event: data,
          }),
        };

        // Send the email using Mailgun
        return mg.messages.create(MAILGUN_DOMAIN, mailOptions)
          .then(() => {
            logger.log('Email sent to:', data.email);
          })
          .catch((error: any) => {
            logger.error('There was an error while sending the email:', error);
          });
      });
    }
  });
