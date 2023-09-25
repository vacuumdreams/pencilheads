import React from 'react';
import { useListVals } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { realtimeDB } from '@/services/firebase';
import { Event } from '@/types';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Alert,
  AlertTitle,
  AlertDescription
} from "@/components/ui/alert"
import { CreateEvent } from './components/create'

export const Dashboard: React.FC = () => {
  const [isCreateOpen, setCreateOpen] = React.useState(false)
  const [events, loading, error] = useListVals<Event>(ref(realtimeDB, 'events'));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(events)

  const currentDate = new Date();
  const upcomingEvents = events?.filter(e => e.scheduledForDate > currentDate);
  const pastEvents = events?.filter(e => e.scheduledForDate <= currentDate);

  return (
    <div>
      {isCreateOpen && <CreateEvent onBack={() => setCreateOpen(false)} />}
      {!isCreateOpen && (
        <Tabs defaultValue="future" className="space-y-4">
          <div className='flex justify-between'>
            <TabsList>
              <TabsTrigger value="future">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="past">
                Past events
              </TabsTrigger>
            </TabsList>
            <Button onClick={() => setCreateOpen(true)}>
              <Icons.plus />
            </Button>
          </div>
          <TabsContent value="future" className="space-y-4">
            {upcomingEvents?.length === 0 && (
              <Alert className='max-w-xl mx-auto text-center'>
                <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
                  <Icons.help width={16} />
                  <span>No data</span>
                </AlertTitle>
                <AlertDescription>
                  <p>There are no upcoming events.</p>
                </AlertDescription>
              </Alert>
            )}
            {upcomingEvents?.map((event, index) => (
              <div key={index}>
                {/* Render your event details */}
              </div>
            ))}
          </TabsContent>
          <TabsContent value="past" className="space-y-4">
            {pastEvents?.length === 0 && (
              <Alert className='max-w-xl mx-auto text-center'>
                <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
                  <Icons.help width={16} />
                  <span>No data</span>
                </AlertTitle>
                <AlertDescription>
                  <p>Looks like there has been no events organised just yet.</p>

                </AlertDescription>
              </Alert>
            )}
            {pastEvents?.map((event, index) => (
              <div key={index}>
                {/* Render your event details */}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
