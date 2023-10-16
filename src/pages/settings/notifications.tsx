import { Link } from 'react-router-dom'
import { User } from 'firebase/auth'
import { useMessaging } from '@/hooks/use-messaging'
import { Switch } from "@/components/ui/switch"

type NotificationsProps = {
  user: User
}

const getNotifiationState = () => {
  if (typeof Notification !== 'undefined') {
    return Notification.permission
  }
  return 'unsupported'
}

export const Notifications = (_: NotificationsProps) => {
  const notificationState = getNotifiationState()
  const { topics, setup, loading } = useMessaging()

  return (
    <div>
      <p className="mb-8">
        Notifications
      </p>
      {notificationState === 'denied' && (
        <Link className="text-sm text-red-500" to='/about#notifications'>
          Notifications are blocked. To use this feature, you need to <span className="underline">enable notifications</span> for the app on your platform.
        </Link>
      )}
      {notificationState === 'unsupported' && (
        <Link className="text-sm text-red-500" to='/about#notifications'>
          Notifications are not supported. <span className="underline">Learn more</span> about how to enable this on your platform.
        </Link>
      )}
      {notificationState === 'default' || notificationState === 'granted' && (
        <div>
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <p className="mb-2">
                New events
              </p>
              <p className="text-sm text-muted-foreground">
                Get a notification whenever there's a new event posted.
              </p>
            </div>
            <Switch
              disabled={loading}
              checked={topics.events}
              onCheckedChange={(checked) => {
                setup({
                  events: checked
                })
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
