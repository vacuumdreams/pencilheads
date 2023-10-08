import React from 'react'
import { Routes, Route } from "react-router-dom";
import { UniversalLayout } from '@/components/layout/universal'
import { InternalLayout } from '@/components/layout/internal'
import { Home } from '@/pages/home/page';
import { Spaces } from '@/pages/spaces/page';
import { Dashboard } from '@/pages/events/dashboard/page';
import { EventsEdit } from '@/pages/events/[id]/page';
import { Invite } from '@/pages/invite/page';
import { Cookies } from '@/pages/cookies/page';
import { NotFound } from '@/pages/not-found/page';
import { Guard } from '@/components/auth/guard';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<UniversalLayout />}>
        <Route index path="/" element={<Home />} />
        <Route path="/dashboard" element={<InternalLayout />}>
          <Route index path="/dashboard" element={<Spaces />} />
          <Route path="/dashboard/:spaceId" element={<Guard />}>
            <Route index path="/dashboard/:spaceId" element={<Dashboard />} />
            <Route path="/dashboard/:spaceId/events/:id" element={<EventsEdit />} />
          </Route>
        </Route>
        <Route path="/invites" element={<Guard />} >
          <Route path="/invites/:id" element={<Invite />} />
        </Route>
        <Route path="/cookies" element={<Cookies />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
