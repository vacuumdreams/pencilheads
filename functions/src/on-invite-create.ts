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

export const onEventCreate = functions.database.ref('events/{id}')
  .onCreate((snapshot) => {
    const data = snapshot.val();

    // Email details
    const mailOptions = {
      from: 'Pencilheads <info@pencilheads.net>',
      to: data.email,
      subject: 'You have been invited!',
      template: 'Invitation',
      'h:X-Mailgun-Variables': JSON.stringify({
        person: data.createdBy.name,
        inviteToken: snapshot.key,
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
