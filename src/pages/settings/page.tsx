import React from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/services/firebase"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

import { Notifications } from "./notifications"
import { AccountForm } from "./account"
import { ProfileForm } from "./profile"
import { DeleteForm } from "./delete"

export function Settings() {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [user] = useAuthState(auth)

  return (
    <div>
      <main className="text-left">
        {user && (
          <>
            <div className="mb-8 rounded-lg border p-4">
              <Notifications user={user} />
            </div>
            <div className="-mx-2 mb-8 rounded-lg p-4 sm:mx-0 sm:border">
              <ProfileForm user={user} />
            </div>
            <div className="-mx-2 mb-8 rounded-lg p-4 sm:mx-0 sm:border">
              <AccountForm user={user} />
            </div>
            <div className="-mx-2 mb-8 rounded-lg p-4 sm:mx-0">
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete my account
              </Button>
            </div>
          </>
        )}
        {user && (
          <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DeleteForm
                user={user}
                onCancel={() => setDeleteDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}
