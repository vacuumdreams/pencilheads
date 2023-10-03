import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from '@/components/layout'
import { Spaces } from '@/pages/spaces/page';
import { Dashboard } from '@/pages/events/dashboard/page';
import { EventsEdit } from '@/pages/events/[id]/page';
import { Invite } from '@/pages/invite/page';
import { NotFound } from '@/pages/not-found/page';
import { Guard } from '@/components/auth/guard';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index path="/" element={<Spaces />} />
        <Route path="/:spaceId" element={<Guard />}>
          <Route index path="/:spaceId" element={<Dashboard />} />
          <Route path="/:spaceId/events/:id" element={<EventsEdit />} />
        </Route>
        <Route path="/invite" element={<Guard />} >
          <Route path="/invite/:id" element={<Invite />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
