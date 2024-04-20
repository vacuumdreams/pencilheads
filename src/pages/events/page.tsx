import React from "react"
import { auth } from "@/services/firebase"
import { addHours } from "date-fns"
import { orderBy, where } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"

import { useMessaging } from "@/hooks/use-messaging"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventList } from "@/components/event/display/list"
import { EventForm } from "@/components/event/form"
import { Icons } from "@/components/icons"

export const Events: React.FC = () => {
  const [user] = useAuthState(auth)
  const { initialize } = useMessaging()
  const [isCreateOpen, setCreateOpen] = React.useState(false)
  const [now] = React.useState(addHours(Date.now(), 6))

  React.useEffect(() => {
    initialize()
  }, [])

  return (
    <div>
      {isCreateOpen && (
        <div>
          <div className="mb-6 grid sm:grid-cols-3">
            <div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setCreateOpen(false)}
              >
                <Icons.arrowLeft size={12} />
                <span>Back</span>
              </Button>
            </div>
            <h3 className="w-full text-center text-xl text-muted-foreground">
              <span className="flex items-center justify-center gap-2">
                <span className="animate-pulse">
                  <Icons.chevronRight size={20} />
                </span>
                <span>create event</span>
              </span>
            </h3>
          </div>
          <EventForm onBack={() => setCreateOpen(false)} />
        </div>
      )}
      {!isCreateOpen && (
        <Tabs defaultValue="future" className="mt-12 space-y-4">
          <div className="mb-16 flex justify-between">
            <TabsList>
              <TabsTrigger value="future">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past events</TabsTrigger>
            </TabsList>
            {user && (
              <Button
                className="flex items-center gap-2"
                disabled={!user}
                onClick={() => setCreateOpen(true)}
              >
                <Icons.plus />
                <span className="hidden sm:inline-block">Create event</span>
              </Button>
            )}
          </div>
          <TabsContent value="future" className="space-y-4">
            <EventList
              isAdmin={false}
              spaceId="PUBLIC"
              filters={[
                where("scheduledFor", ">=", now),
                orderBy("scheduledFor", "asc"),
              ]}
              noEventsMessage="There are no upcoming events."
            />
          </TabsContent>
          <TabsContent value="past" className="space-y-4">
            <EventList
              isAdmin={false}
              spaceId="PUBLIC"
              filters={[
                where("scheduledFor", "<", now),
                orderBy("scheduledFor", "desc"),
              ]}
              noEventsMessage="Looks like there has been no events organised just yet."
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
