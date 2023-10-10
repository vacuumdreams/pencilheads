import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "@/routes";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorScreen } from "@/components/error-screen";

import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorScreen}
    >
      <BrowserRouter>
        <ThemeProvider attribute="class" enableSystem>
          <Toaster />
          <AppRouter />
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
