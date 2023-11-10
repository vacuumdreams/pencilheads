import React from "react"
import { Route } from "react-router-dom"
import { UniversalLayout } from "@/components/layout/universal"
import { InternalLayout } from "@/components/layout/internal"

import { SentryRoutes } from "@/services/sentry"

import { Home } from "@/pages/home/page"
import { Login } from "@/pages/login/page"
import { About } from "@/pages/about/page"
import { Events } from "@/pages/events/page"
import { Spaces } from "@/pages/spaces/page"
import { Venues } from "@/pages/venues/page"
import { SpaceEvents } from "@/pages/spaces/events/page"
import { EventsEdit } from "@/pages/spaces/events/[id]/page"
import { Settings } from "@/pages/settings/page"
import { Invite } from "@/pages/invite/page"
import { Cookies } from "@/pages/cookies/page"
import { NotFound } from "@/pages/not-found/page"
import { Guard } from "@/components/auth/guard"

export const AppRouter: React.FC = () => {
  return (
    <SentryRoutes>
      <Route path="/" element={<UniversalLayout />}>
        <Route index path="/" element={<Home />} />

        <Route path="/login" element={<InternalLayout />}>
          <Route index path="/login" element={<Login />} />
        </Route>

        <Route path="/dashboard" element={<InternalLayout />}>
          <Route index path="/dashboard" element={<Events />} />
          <Route path="/dashboard/events/:id" element={<EventsEdit />} />
        </Route>

        <Route path="/spaces" element={<InternalLayout />}>
          <Route index path="/spaces" element={<Spaces />} />
          <Route path="/spaces/:spaceId" element={<Guard />}>
            <Route index path="/spaces/:spaceId" element={<SpaceEvents />} />
            <Route
              path="/spaces/:spaceId/events/:id"
              element={<EventsEdit />}
            />
          </Route>
        </Route>

        <Route path="/venues" element={<InternalLayout />}>
          <Route index path="/venues" element={<Venues />} />
        </Route>

        <Route path="/settings" element={<InternalLayout />}>
          <Route index path="/settings" element={<Settings />} />
        </Route>

        <Route path="/invites" element={<Guard />}>
          <Route path="/invites/:id" element={<Invite />} />
        </Route>

        <Route path="/about" element={<About />} />

        <Route path="/cookies" element={<Cookies />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </SentryRoutes>
  )
}
