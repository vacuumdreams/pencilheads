import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Transition } from 'react-transition-group'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import { useToast } from '@/components/ui/use-toast'
import { auth } from '@/services/firebase'
import { cn, getUserName } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Animation } from '@/components/animations';
import { Avatar } from '@/components/avatar-group'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const navigation = [
  { name: 'Events', href: '/dashboard', icon: <Icons.calendar /> },
  { name: 'Groups', href: '/spaces', icon: <Icons.users /> },
  { name: 'Settings', href: '/settings', icon: <Icons.settings /> },
]

const captions = [
  'You look amazing today!',
  ''
]

export const InternalLayout = () => {
  const [isSheetOpen, setSheetOpen] = React.useState(false)
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
                  <Button onClick={() => setSheetOpen(true)}><Icons.chevronLeftSquare /></Button>
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
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader className="flex justify-start mb-6">
            <SheetTitle>
              {user && (
                <div className="flex gap-4 justify-start items-center">
                  <Avatar
                    className="w-8 h-8"
                    person={{
                      name: getUserName(user),
                      email: user.email || '',
                      photoUrl: user.photoURL,
                    }}
                  />
                  <span>Hello, {getUserName(user).split(' ')[0]}</span>
                </div>
              )}
            </SheetTitle>
          </SheetHeader>
          <SheetDescription className="text-left mb-8">
            {captions[0]}
          </SheetDescription>
          <NavigationMenu orientation='vertical' className="w-[calc(100%_+_4rem)] max-w-none flex-col justify-stretch -mx-6">
            {navigation.map(({ name, href, icon }) => (
              <NavigationMenuLink asChild key={href}>
                <NavLink
                  to={href}
                  onClick={() => setSheetOpen(false)}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'justify-start gap-2 py-6 w-full max-w-none flex-1 px-6',
                    '[&.active]:bg-accent'
                  )}
                >
                  {icon}
                  {name}
                </NavLink>
              </NavigationMenuLink>
            ))}
          </NavigationMenu>
          <SheetFooter className="pt-6">
            <Button
              className="flex gap-2"
              onClick={onSignOut}
            >
              <Icons.logOut />
              <span>Sign Out</span>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div >
  )
}
