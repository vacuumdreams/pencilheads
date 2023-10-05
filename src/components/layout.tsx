import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Transition } from 'react-transition-group'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import { auth } from '@/services/firebase'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Animation } from '@/components/animations';

export const Layout = () => {
  const navigate = useNavigate()
  const headerRef = React.useRef(null)
  const { toast } = useToast()
  const [user, loading, error] = useAuthState(auth)
  const [signOut] = useSignOut(auth)

  const onSignOut = () => {
    signOut()
    navigate('/')
  }

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
        "h-screen overflow-x-hidden overflow-y-auto bg-background pb-24 pr-0 bg-background",
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
                  <Button onClick={onSignOut}><Icons.logOut /></Button>
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
        {!loading && <Outlet />}
      </div>
    </div>
  )
}
