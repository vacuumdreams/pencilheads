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

const getNewGuests = (prevData, data) => {
  return data.guests.filter(guest => {
    return !prevData.guests.find(prevGuest => prevGuest.email === guest.email)
  })
}

const getNewSubscribers = (prevData, data) => {
  return data.subscriptions.filter(sub => {
    return !prevData.subscriptions.find(prevSub => prevSub.email === sub.email)
  })
}

export const onEventWrite = functions.database.ref('events/{id}')
  .onWrite((snapshot) => {
    const prevData = snapshot.before.val()
    const data = snapshot.after.val()

    const newSubscribers = getNewSubscribers(prevData, data).map(sub => ({
      from: 'Pencilheads <info@pencilheads.net>',
      to: sub.email,
      subject: `You are going!`,
      template: 'Event subscription',
      'h:X-Mailgun-Variables': JSON.stringify({
        subscriber: sub,
        event: data,
      }),
    }))
    const newGuests = getNewGuests(prevData, data).map(guest => ({
      from: 'Pencilheads <info@pencilheads.net>',
      to: guest.email,
      subject: `${guest.invitedBy.name} has invited you to an event!`,
      template: 'Event invite',
      'h:X-Mailgun-Variables': JSON.stringify({
        guest,
        event: data,
      }),
    }))

    return Promise.all([
      newSubscribers.map(opts => mg.messages.create(MAILGUN_DOMAIN, opts)
        .then(() => {
          logger.log('Event subscription email sent to:', opts.to);
        })
        .catch((error: any) => {
          logger.error('There was an error while sending the email:', error);
        })
      ),
      newGuests.map(opts => mg.messages.create(MAILGUN_DOMAIN, opts)
        .then(() => {
          logger.log('Event guest invite email sent to:', opts.to);
        })
        .catch((error: any) => {
          logger.error('There was an error while sending the email:', error);
        })
      )
    ])
  });
