# <img src="/public/pencilhead.svg" width="54px" align="center" alt="Pencilhead" /> pencilheads

We have a small movie club going with some friends, and I've created this app to experiment with some ideas. Go check it out [in the wild](https://pencilheads.net/).

### Stack

This is a React app using [Firebase](https://firebase.google.com/) (db, auth, hosting, storage, functions). I've used [Workbox](https://github.com/GoogleChrome/workbox) to set up the PWA features and the service worker, [shadcn/ui](https://ui.shadcn.com/) was my choice of ui library, bundled using [Vite](https://vitejs.dev/).  

### Development

Prerequisites:
- [Bun](https://bun.sh)

Preparation:
- `bun install`

Run the app:
- `bun dev`

### Environment

If this is run locally, you can add all these variables into an `.env` file to the root of the repo. These are set up into the github environment.

To start with, the app needs to connect to firebase, so will need to set up a project and get all the variables into the environment: 
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_REGION=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=1
VITE_FIREBASE_MESSAGING_PUBLIC_KEY=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

I've used the [OMDB API](https://www.omdbapi.com/) for fetching movie related metadata when creating a new event. It's free to register and you get a few thousand requests per month, which does the job for now.
```
VITE_OMDB_API_KEY=
```

Set up some basic email notifications which run in a cloud function, using [Mailgun](https://www.mailgun.com/) for this:
```
MAILGUN_DOMAIN=
MAILGUN_API_KEY=
```

Experimented with creating a Pencilhead Telegram bot, which could be added to channels and would post about new events. This is also running in a cloud function, and needs a telegram token:
```
TELEGRAM_TOKEN=
```

Public and private sentry variables:
```
VITE_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```
