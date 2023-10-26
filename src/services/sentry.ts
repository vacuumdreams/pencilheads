import React from 'react'
import * as Sentry from "@sentry/react";
import {
  Routes,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";

export function initSentry() {
  const dns = String(import.meta.env.VITE_SENTRY_DSN)

  if (dns) {
    Sentry.init({
      dsn: String(import.meta.env.VITE_SENTRY_DSN),
      integrations: [
        new Sentry.BrowserTracing({
          // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
          tracePropagationTargets: ["localhost", /^https:\/\/pencilheads\.net/],
          routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes
          ),
        }),
        new Sentry.Replay(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  }
}

export const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);
