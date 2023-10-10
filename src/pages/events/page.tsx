import React from 'react';
import { Link } from 'react-router-dom';
import { Transition } from 'react-transition-group'
import { where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/services/firebase';
import { useMessaging } from '@/hooks/use-messaging';
import { cn } from '@/lib/utils'
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
  useMessaging()
  const titleRef = React.useRef(null)
  const [user] = useAuthState(auth)
  const [isCreateOpen, setCreateOpen] = React.useState(false)
  const [now] = React.useState(new Date())

  return (
    <Guard>
      <div className='w-full pb-8 pt-20 gap-4 mb-12 flex items-center'>
        <Transition
          nodeRef={titleRef}
          in={!!user}
          timeout={200}
        >
          {state => (
            <Link
              to="/"
              ref={titleRef}
              className={cn('w-full cursor-pointer text-center opacity-0 transition-opacity duration-1000', {
                'opacity-100': ['entering', 'entered'].includes(state),
              })}
            >
              <h1 className='font-mono text-4xl sm:text-5xl md:text-6xl lg:text-8xl'>
                pencilheads
              </h1>
            </Link>
          )}
        </Transition>
      </div>
      {isCreateOpen && <EventForm onBack={() => setCreateOpen(false)} />}
      {!isCreateOpen && (
        <Tabs defaultValue="future" className="space-y-4">
          <div className='flex justify-between mb-16'>
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
