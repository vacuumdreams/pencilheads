import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getToken } from 'firebase/messaging'
import { auth, messaging } from '@/services/firebase'
import { useToast } from '@/components/ui/use-toast'
import { useMutate } from '@/hooks/use-mutate'
import { Button } from '@/components/ui/button'

type InitMessagingProps = {
  toast: ReturnType<typeof useToast>['toast']
  saveToken: (token: string) => Promise<void>
}

const disabledNotifications = localStorage.getItem('notifications-disabled')

const initMessaging = async ({ toast, saveToken }: InitMessagingProps) => {
  try {
    const token = await getToken(messaging)
    await saveToken(token)
  } catch (error) {
    toast({
      title: 'Error',
      description: `${error}`,
      variant: 'destructive',
    })
  }
}

export const useMessaging = () => {
  const { toast, dismiss } = useToast()
  const [user] = useAuthState(auth)
  const { set, loading } = useMutate()

  console.log(Notification.permission)

  React.useEffect(() => {
    if (user) {
      if (Notification.permission !== 'granted' && !disabledNotifications) {
        setTimeout(() => {
          toast({
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
                        await initMessaging({
                          toast,
                          saveToken: async (token) => {
                            await set(`/devices/${token}`, {
                              uid: user.uid,
                              token,
                              events: true,
                            })
                          },
                        })
                        dismiss()
                      }
                    }}
                  >
                    Enable
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      dismiss()
                    }}
                  >
                    Dismiss
                  </Button>
                </div>
                <button
                  onClick={async () => {
                    localStorage.setItem('notifications-disabled', 'true')
                    dismiss()
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
}
