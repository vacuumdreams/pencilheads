import React from 'react'
import { Outlet } from 'react-router-dom'
import { onMessage } from 'firebase/messaging'
import { messaging } from '@/services/firebase'
// import { Button, buttonVariants } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

// const cookiePreferences = localStorage.getItem('cookie-preferences')

export const UniversalLayout = () => {
  const { toast } = useToast()

  React.useEffect(() => {
    onMessage(messaging, (payload) => {
      toast({
        title: payload.notification?.title,
        description: payload.notification?.body,
      })
    })
  }, [])

  // React.useEffect(() => {
  //   if (cookiePreferences !== 'rejected') {
  //     setTimeout(() => {
  //       toast({
  //         title: 'Cookies and privacy',
  //         duration: Infinity,
  //         description: (
  //           <div className='w-full'>
  //             <p className="mb-4">We use cookies on this site.</p>
  //             <div className="flex gap-2 mb-2">
  //               <Button onClick={() => {
  //                 localStorage.setItem('cookie-preferences', 'accepted')
  //                 dismiss()
  //               }}>
  //                 Accept
  //               </Button>
  //               <NavLink
  //                 to="/cookies"
  //                 className={buttonVariants({ variant: 'outline' })}
  //                 onClick={() => dismiss()}
  //               >
  //                 Learn more
  //               </NavLink>
  //             </div>
  //             <div className="w-full flex">
  //               <button
  //                 onClick={() => {
  //                   localStorage.setItem('cookie-preferences', 'rejected')
  //                 }}
  //               >
  //                 Don't show again
  //               </button>
  //             </div>
  //           </div>
  //         ),
  //       })
  //     }, 2000)
  //   }
  // }, [])

  return (
    <Outlet />
  )
}
