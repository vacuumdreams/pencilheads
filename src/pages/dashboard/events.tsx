import React from 'react';
import { useList } from 'react-firebase-hooks/database';
import { DataSnapshot, ref } from 'firebase/database';
import { realtimeDB } from '@/services/firebase';
import { DBEvent, Event } from '@/types';
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
import { EventList } from './components/event/event-list';

type OrderedEvents = {
  keys: string[]
  upcomingEvents: Event[]
  pastEvents: Event[]
}

const getEvents = (snapshots?: DataSnapshot[]) => {
  const now = new Date()
  return snapshots?.reduce<OrderedEvents>((acc, item) => {
    if (!(item && item.key) || (item.key && acc.keys.includes(item.key))) {
      return acc
    }

    const val = item.val() as DBEvent
    const scheduledForDate = new Date(val.scheduledForDate)
    const createdAt = new Date(val.createdAt)
    const updatedAt = new Date(val.updatedAt)
    const event: Event = {
      ...val,
      createdAt,
      updatedAt,
      scheduledForDate,
    }

    if (now > scheduledForDate) {
      acc.pastEvents.push(event)
    } else {
      acc.upcomingEvents.push(event)
    }
    acc.keys.push(item.key)

    return acc
  }, {
    keys: [],
    upcomingEvents: [],
    pastEvents: [],
  }) || {
    keys: [],
    upcomingEvents: [],
    pastEvents: [],
  }
}

export const Events: React.FC = () => {
  const [isCreateOpen, setCreateOpen] = React.useState(false)
  const [snapshots, loading, error] = useList(ref(realtimeDB, 'events'));

  console.log(snapshots)

  const { upcomingEvents, pastEvents } = getEvents(snapshots)

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
          {loading && (
            <div className="flex w-full p-16 justify-center">
              <Icons.spinner className="animate-spin" />
            </div>
          )}
          {error && (
            <Alert variant="destructive" className='max-w-xl mx-auto text-center'>
              <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
                <Icons.warning width={16} />
                <span>Error</span>
              </AlertTitle>
              <AlertDescription>
                <p>Failed loading events</p>
                <p>{error.message}</p>
              </AlertDescription>
            </Alert>
          )}
          <TabsContent value="future" className="space-y-4">
            <EventList
              events={upcomingEvents}
              noEventsMessage="There are no upcoming events."
            />
          </TabsContent>
          <TabsContent value="past" className="space-y-4">
            <EventList
              events={pastEvents}
              noEventsMessage="Looks like there has been no events organised just yet."
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
