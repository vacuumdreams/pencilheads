import React from 'react'
import { Outlet } from 'react-router-dom'
import { Transition } from 'react-transition-group'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import { auth } from '@/services/firebase'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Animation } from '@/components/animations';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { InviteForm } from '@/components/invite/form'

export const Layout = () => {
  const headerRef = React.useRef(null)
  const [isInviteOpen, setInviteOpen] = React.useState(false)
  const { toast } = useToast()
  const [user, loading, error] = useAuthState(auth)
  const [signOut] = useSignOut(auth)

  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }, [error])

  return (
    <div
      className={cn(
        "h-screen overflow-x-hidden overflow-y-auto bg-background pb-8 pr-0 bg-background",
        "scrollbar scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-md"
      )}
    >
      <div className="container px-2 md:px-4">
        <Transition nodeRef={headerRef} in={!!user} timeout={1500}>
          {(state) => (
            <header
              ref={headerRef}
              className={cn('w-32 mx-auto transition-all delay-0 duration-500 h-32', {
                'delay-500 0 h-0': ['entered', 'entering'].includes(state) && !!user,
              })}
            >
              <div className={cn('absolute right-2 md:right-4 top-0 transition-transform -translate-y-32 delay-1000 duration-500', {
                'translate-y-0': ['entered', 'entering'].includes(state),
              })}>
                <div className="flex justify-end gap-1">
                  <Button variant={'secondary'} onClick={() => setInviteOpen(true)}><Icons.invite /></Button>
                  <Button onClick={signOut}><Icons.logOut /></Button>
                </div>
              </div>
              <div className={cn('transition-transform duration-1000', {
                'translate-x-[60vw]': ['entered', 'entering'].includes(state),
                'hidden': state === 'entered',
              })}>
                <Animation name='pencilhead' />
              </div>
            </header>
          )}
        </Transition>
        <h1 className="font-mono text-4xl text-center mt-12 mb-16">pencilheads</h1>
        {!loading && <Outlet />}
      </div>
      <Dialog open={isInviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <InviteForm
            onSuccess={(email) => {
              setInviteOpen(false)
              toast({
                title: 'Success',
                description: `Invite sent to ${email}`,
                variant: 'default',
              })
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
