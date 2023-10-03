import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

import {inviteCreate} from "./on-invite-create";
import {inviteUpdate} from "./on-invite-update";

export const onInviteCreate = inviteCreate(db);
export const onInviteUpdate = inviteUpdate(auth, db);
