import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from '@/components/layout'
import { Dashboard } from '@/pages/dashboard/page';
import { Invite } from '@/pages/invite/page';
import { EventsEdit } from '@/pages/events/[id]/page';
import { NotFound } from '@/pages/not-found/page';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index path="/" element={<Dashboard />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/events/:id" element={<EventsEdit />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
