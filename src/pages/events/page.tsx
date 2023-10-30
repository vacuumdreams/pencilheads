import React from 'react';
import { where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/services/firebase';
import { useMessaging } from '@/hooks/use-messaging';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Guard } from '@/components/auth/guard'
import { EventForm } from '@/components/event/form'
import { EventList } from '@/components/event/display/list';

export const Events: React.FC = () => {
  const { initialize } = useMessaging()
  const [isCreateOpen, setCreateOpen] = React.useState(false)
  const [now] = React.useState(new Date())

  React.useEffect(() => {
    initialize()
  }, [])

  return (
    <Guard>
      {isCreateOpen && (
        <div>
          <div className="grid sm:grid-cols-3 mb-6">
            <div>
              <Button
                variant="outline"
                className='flex gap-2 items-center'
                onClick={() => setCreateOpen(false)}
              >
                <Icons.arrowLeft size={12} />
                <span>Back</span>
              </Button>
            </div>
            <h3 className="w-full text-center text-xl text-muted-foreground">
              <span className="flex items-center justify-center gap-2">
                <span className="animate-pulse"><Icons.chevronRight size={20} /></span>
                <span>create event</span>
              </span>
            </h3>
          </div>
          <EventForm onBack={() => setCreateOpen(false)} />
        </div>
      )}
      {!isCreateOpen && (
        <Tabs defaultValue="future" className="space-y-4 mt-12">
          <div className='flex justify-between mb-16'>
            <TabsList>
              <TabsTrigger value="future">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="past">
                Past events
              </TabsTrigger>
            </TabsList>
            <Button className="flex gap-2 items-center" onClick={() => setCreateOpen(true)}>
              <Icons.plus />
              <span className="hidden sm:inline-block">Create event</span>
            </Button>
          </div>
          <TabsContent value="future" className="space-y-4">
            <EventList
              isAdmin={false}
              spaceId="PUBLIC"
              filters={[where('scheduledFor', '>=', now)]}
              noEventsMessage="There are no upcoming events."
            />
          </TabsContent>
          <TabsContent value="past" className="space-y-4">
            <EventList
              isAdmin={false}
              spaceId="PUBLIC"
              filters={[where('scheduledFor', '<', now)]}
              noEventsMessage="Looks like there has been no events organised just yet."
            />
          </TabsContent>
        </Tabs>
      )}
    </Guard>
  );
}
