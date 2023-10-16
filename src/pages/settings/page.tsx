import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/services/firebase'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

import { Notifications } from './notifications'
import { AccountForm } from './account'
import { ProfileForm } from './profile'
import { DeleteForm } from './delete'

export function Settings() {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [user] = useAuthState(auth)

  return (
    <div className="pt-12 sm:pt-24 md:pt-48">
      <header>
        <h1 className="font-mono text-xl">pencilheads</h1>
      </header>
      <main>
        <h3 className="font-mono text-4xl mb-12">Settings</h3>
        {user && (
          <>
            <div className="rounded-lg border p-4 mb-8">
              <Notifications user={user} />
            </div>
            <div className="rounded-lg sm:border p-4 mb-8 -mx-2 sm:mx-0">
              <ProfileForm user={user} />
            </div>
            <div className="rounded-lg sm:border p-4 mb-8 -mx-2 sm:mx-0">
              <AccountForm user={user} />
            </div>
            <div className="rounded-lg sm:border p-4 mb-8 -mx-2 sm:mx-0">
              <Button variant='destructive' onClick={() => setDeleteDialogOpen(true)}>
                Delete my account
              </Button>
            </div>
          </>
        )}
        {user && (
          <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DeleteForm user={user} onCancel={() => setDeleteDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}
