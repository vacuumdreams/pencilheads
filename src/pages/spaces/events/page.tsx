import React from 'react';
import { Transition } from 'react-transition-group'
import { useNavigate } from 'react-router-dom';
import { where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/services/firebase';
import { useSpace } from '@/hooks/use-data'
import { useToast } from '@/components/ui/use-toast'
import { useSpaceId } from '@/hooks/use-space'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { ErrorScreen } from '@/components/error-screen';
import { InviteForm } from '@/components/invite/form'
import { Guard } from '@/components/auth/guard'
import { EventForm } from '@/components/event/form'
import { EventList } from '@/components/event/display/list';
import { GroupInfo } from './group'

export const SpaceEvents: React.FC = () => {
  const inviteRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const navigate = useNavigate()
  const { toast } = useToast()
  const [user] = useAuthState(auth)
  const spaceId = useSpaceId()
  const [space, loading, error] = useSpace({ id: spaceId })
  const [isInviteDialogOpen, setInviteDialogOpen] = React.useState(false)
  const [isCreateOpen, setCreateOpen] = React.useState(false)
  const [isGroupDialogOpen, setGroupDialogOpen] = React.useState(false)
  const members = Object.values(space?.members || {})
  const [now] = React.useState(new Date())
  const isAdmin = !!user && !!space && space.members[user.uid]?.role === 'admin'

  return (
    <Guard>
      <div className='w-full pb-8 pt-20 grid gap-4 sm:grid-cols-3 mb-12 [&>*]:flex [&>*]:items-center'>
        <div className="flex gap-1 sm:justify-start">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <Icons.arrowLeft />
          </Button>
        </div>
        <div className='justify-center'>
          <Transition
            nodeRef={titleRef}
            in={!!space?.name}
            timeout={200}
          >
            {state => (
              <div
                role='button'
                tabIndex={0}
                onClick={() => setGroupDialogOpen(true)}
                ref={titleRef}
                className={cn('cursor-pointer text-center opacity-0 transition-opacity duration-1000', {
                  'opacity-100': ['entering', 'entered'].includes(state),
                })}
              >
                <h1 className='font-mono text-3xl'>
                  {space?.name}
                </h1>
                <p>
                  {members.length} {members.length === 1 ? 'member' : 'members'}
                </p>
              </div>
            )}
          </Transition>
        </div>
        <div className='w-full justify-center sm:justify-end'>
          <Transition
            nodeRef={inviteRef}
            in={!!space && !!user}
            timeout={200}
          >
            {state => (
              <div ref={inviteRef} className={cn('grid  gap-2 opacity-0 transition-opacity duration-1000', {
                'opacity-100': ['entering', 'entered'].includes(state),
                'grid-rows-2': !!space?.telegramInviteLink && isAdmin,
                'grid-rows-1': !space?.telegramInviteLink || isAdmin,
              })}>
                {space?.telegramInviteLink && (
                  <Button variant="outline" asChild className='flex gap-2'>
                    <a
                      href={space.telegramInviteLink}
                      rel="noopener noreferrer"
                      target='_blank'
                    >
                      <Icons.invite width={24} />
                      <span>Telegram</span>
                    </a>
                  </Button>
                )}
                {isAdmin && (
                  <Button disabled={loading || !!error} variant="outline" onClick={() => setInviteDialogOpen(true)}>
                    <Icons.mail />
                    <span className="ml-2">Invite someone</span>
                  </Button>
                )}
              </div>
            )}
          </Transition>
        </div>
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
          {error && (
            <ErrorScreen
              error={error}
              resetErrorBoundary={() => navigate('/dashboard')}
            />
          )}
          {!error && spaceId && (
            <>
              <TabsContent value="future" className="space-y-4">
                <EventList
                  isAdmin={isAdmin}
                  spaceId={spaceId}
                  filters={[where('scheduledFor', '>=', now)]}
                  noEventsMessage="There are no upcoming events."
                />
              </TabsContent>
              <TabsContent value="past" className="space-y-4">
                <EventList
                  isAdmin={isAdmin}
                  spaceId={spaceId}
                  filters={[where('scheduledFor', '<', now)]}
                  noEventsMessage="Looks like there has been no events organised just yet."
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      )}
      {user && (
        <Dialog open={isInviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogContent>
            <InviteForm
              user={user}
              members={members}
              onSuccess={(email) => {
                setInviteDialogOpen(false)
                toast({
                  title: 'Success',
                  description: `Invite sent to ${email}`,
                  variant: 'default',
                })
              }}
            />
          </DialogContent>
        </Dialog>
      )}
      {user && space && (
        <Dialog open={isGroupDialogOpen} onOpenChange={setGroupDialogOpen}>
          <DialogContent>
            <GroupInfo
              isAdmin={isAdmin}
              space={space}
            />
          </DialogContent>
        </Dialog>
      )}
    </Guard>
  );
}
