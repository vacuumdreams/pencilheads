import React from "react"
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom"
import { Transition } from "react-transition-group"
import { useAuthState, useSignOut } from "react-firebase-hooks/auth"
import { useToast } from "@/components/ui/use-toast"
import { auth } from "@/services/firebase"
import { cn, getUser, getUserName } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/avatar-group"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const navigation = [
  { name: "Events", href: "/dashboard", icon: <Icons.calendar /> },
  { name: "Groups", href: "/spaces", icon: <Icons.users /> },
  { name: "Venues", href: "/venues", icon: <Icons.mapPin /> },
  { name: "Settings", href: "/settings", icon: <Icons.settings /> },
]

const captions = ["You look amazing today!", ""]

export const InternalLayout = () => {
  const location = useLocation()
  const [isSheetOpen, setSheetOpen] = React.useState(false)
  const navigate = useNavigate()
  const headerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const subtitleRef = React.useRef(null)
  const { toast } = useToast()
  const [user, loading, error] = useAuthState(auth)
  const [signOut] = useSignOut(auth)

  const currentPath = navigation.find((n) => n.href === location.pathname)

  const onSignOut = () => {
    signOut()
    navigate("/")
  }

  React.useEffect(() => {
    if (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }, [error])

  return (
    <div
      className={cn(
        "bg-background h-screen overflow-y-auto overflow-x-hidden pb-24 pr-0",
        "scrollbar scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-md"
      )}
    >
      <div className="container px-2 md:px-4">
        <Transition nodeRef={headerRef} in={!loading} timeout={1500}>
          {(state) => (
            <header
              ref={headerRef}
              className={cn(
                "mx-auto h-32 w-32 transition-all delay-0 duration-500",
                {
                  "0 h-0 delay-500": ["entered", "entering"].includes(state),
                }
              )}
            >
              <div
                className={cn(
                  "absolute right-2 top-0 z-10 -translate-y-32 transition-transform delay-1000 duration-500 md:right-4",
                  {
                    "translate-y-0": ["entered", "entering"].includes(state),
                  }
                )}
              >
                <div className="flex justify-end gap-1">
                  {user && (
                    <Button onClick={() => setSheetOpen(true)}>
                      <Icons.chevronLeftSquare />
                    </Button>
                  )}
                  {!user && (
                    <Button
                      disabled={location.pathname === "/login"}
                      className="flex gap-2"
                      onClick={() => navigate("/login")}
                    >
                      <Icons.logIn />
                      <span>Sign up</span>
                    </Button>
                  )}
                </div>
              </div>
            </header>
          )}
        </Transition>
        <div className="w-full items-center gap-4 pt-20 text-center">
          <Transition nodeRef={titleRef} in={!loading} timeout={200}>
            {(state) => (
              <NavLink
                to="/dashboard"
                ref={titleRef}
                className={cn(
                  "w-full cursor-pointer",
                  "opacity-0 transition-opacity duration-1000",
                  {
                    "opacity-100": ["entering", "entered"].includes(state),
                  }
                )}
              >
                <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl lg:text-8xl">
                  pencilheads
                </h1>
              </NavLink>
            )}
          </Transition>
          <Transition nodeRef={subtitleRef} in={!loading} timeout={200}>
            {(state) => (
              <h3
                ref={subtitleRef}
                className={cn(
                  "text-muted-foreground mb-12 w-full font-mono text-2xl md:text-4xl",
                  "opacity-0 transition-opacity duration-1000",
                  {
                    "opacity-100": ["entering", "entered"].includes(state),
                  }
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>{currentPath?.icon}</span>
                  <span>{currentPath?.name.toLowerCase()}</span>
                </span>
              </h3>
            )}
          </Transition>
          {!loading && <Outlet />}
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent>
            <SheetHeader className="mb-6 flex justify-start">
              <SheetTitle>
                {user && (
                  <div className="flex items-center justify-start gap-4">
                    <Avatar className="h-8 w-8" person={getUser(user)} />
                    <span>Hello, {getUserName(user).split(" ")[0]}</span>
                  </div>
                )}
              </SheetTitle>
            </SheetHeader>
            <SheetDescription className="mb-8 text-left">
              {captions[0]}
            </SheetDescription>
            <NavigationMenu
              orientation="vertical"
              className="-mx-6 w-[calc(100%_+_4rem)] max-w-none flex-col justify-stretch"
            >
              {navigation.map(({ name, href, icon }) => (
                <NavigationMenuLink asChild key={href}>
                  <NavLink
                    to={href}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "w-full max-w-none flex-1 justify-start gap-2 px-6 py-6",
                      "[&.active]:bg-accent"
                    )}
                  >
                    {icon}
                    {name}
                  </NavLink>
                </NavigationMenuLink>
              ))}
            </NavigationMenu>
            <SheetFooter className="pt-6">
              <Button className="flex gap-2" onClick={onSignOut}>
                <Icons.logOut />
                <span>Sign Out</span>
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
