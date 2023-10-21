import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import { initSentry } from '@/services/sentry'
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "@/routes";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorScreen } from "@/components/error-screen";

import "./styles/globals.css";

initSentry()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <ErrorScreen
          error="Something went wrong. Please refresh the page."
          resetErrorBoundary={() => window.location.reload()}
        />
      }
    >
      <BrowserRouter>
        <ThemeProvider attribute="class" enableSystem>
          <Toaster />
          <AppRouter />
        </ThemeProvider>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
