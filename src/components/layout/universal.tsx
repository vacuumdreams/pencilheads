import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Icons } from '@/components/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastProvider,
} from '@/components/ui/toast'

const cookiePreferences = localStorage.getItem('cookie-preferences')

export const UniversalLayout = () => {
  const [isCookieToastOpen, setCookieToastOpen] = React.useState(false)

  React.useEffect(() => {
    if (!cookiePreferences) {
      setTimeout(() => {
        setCookieToastOpen(true)
      }, 2000)
    }
  }, [])

  return (
    <div>
      <Outlet />
      <ToastProvider>
        <Toast variant='default' open={isCookieToastOpen}>
          <div className="grid gap-1">
            <div className="flex gap-2 items-center mb-4">
              <Icons.help />
              <ToastTitle className="flex gap-2">Cookie policy</ToastTitle>
            </div>
            <ToastDescription>
              <p>We use cookies to improve your experience on our site.</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => localStorage.setItem('cookie-preferences', 'accepted')}
                >
                  Accept
                </Button>
                <Link to="/cookies" className={buttonVariants({ variant: 'outline' })}>
                  Details
                </Link>
              </div>
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      </ToastProvider>
    </div>
  )
}
