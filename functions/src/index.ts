import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const messaging = admin.messaging();

db.settings({ignoreUndefinedProperties: true});

import {inviteCreate} from "./on-invite-create";
import {inviteUpdate} from "./on-invite-update";
import {eventCreate} from "./on-event-create";

export const onInviteCreate = inviteCreate(db);
export const onInviteUpdate = inviteUpdate(auth, db);
export const onEventCreate = eventCreate(db, messaging);
