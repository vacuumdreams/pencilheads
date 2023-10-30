import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getToken, isSupported } from 'firebase/messaging'
import { auth, messaging } from '@/services/firebase'
import { useToast } from '@/components/ui/use-toast'
import { useMutate } from '@/hooks/use-mutate'
import { Button } from '@/components/ui/button'
import { Device } from '@/types'

const disabledNotifications = localStorage.getItem('notifications-disabled')

type Topics = {
  events: boolean
}

export const useMessaging = () => {
  const [token, setToken] = React.useState<string | null>(null)
  const [topics, setTopics] = React.useState({
    events: false
  })
  const { toast, dismiss } = useToast()
  const [user] = useAuthState(auth)
  const { set } = useMutate<Device>('device')
  const [loading, setLoading] = React.useState(false)

  const setup = React.useCallback(async (topics?: Topics) => {
    if (!user) throw new Error('You need to be signed in to enable notifications')
    setLoading(true)

    try {
      const serviceWorkerRegistration = await navigator.serviceWorker.getRegistration()
      const t = await getToken(messaging, {
        vapidKey: String(import.meta.env.VITE_FIREBASE_MESSAGING_PUBLIC_KEY),
        serviceWorkerRegistration: serviceWorkerRegistration,
      })
      if (t) {
        setToken(t)
        await set(`/devices/${token}`, {
          uid: user.uid,
          token: t,
          events: topics?.events ?? true,
          updatedAt: new Date(),
        })
        setTopics(topics || {
          events: true
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: `${error}`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [user])

  const initialize = React.useCallback(async () => {
    const hasSupport = await isSupported()

    if (!hasSupport) {
      toast({
        title: 'Notifications are not supported',
        description: 'Your platform does not support notifications. To make the most out of the app, make sure you are using the most up top date version of your browser + OS.',
      })

      return
    }

    if (user && typeof Notification !== 'undefined') {
      if (Notification.permission === 'granted') {
        setup()
      }
      if (Notification.permission === 'denied' && !disabledNotifications) {
        setTimeout(() => {
          const t = toast({
            title: 'Notifications disabled',
            description: (
              <div>
                <p className="mb-4">Your notifications are currently disabled. You can enable them any time in your browser settings.</p>
                <button
                  onClick={async () => {
                    localStorage.setItem('notifications-disabled', 'true')
                    dismiss(t.id)
                  }}
                >
                  Don't show again
                </button>
              </div>
            ),
          })
        }, 2500)
      }
      if (Notification.permission === 'default' && !disabledNotifications) {
        setTimeout(() => {
          const t = toast({
            title: 'Enable notifications',
            duration: Infinity,
            description: (
              <div>
                <p className="mb-4">Don't miss out on new events.</p>
                <div className="flex gap-2 mb-2">
                  <Button
                    onClick={async () => {
                      const permission = await Notification.requestPermission()
                      if (permission === 'granted') {
                        await setup()
                        dismiss(t.id)
                      }
                    }}
                  >
                    Enable
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      dismiss(t.id)
                    }}
                  >
                    Dismiss
                  </Button>
                </div>
                <button
                  onClick={async () => {
                    localStorage.setItem('notifications-disabled', 'true')
                    dismiss(t.id)
                  }}
                >
                  Don't show again
                </button>
              </div>
            ),
          })
        }, 5000)
      }
    }
  }, [user])

  return { token, topics, initialize, loading, setup }
}
