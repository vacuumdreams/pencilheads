import React from 'react'
import { User } from 'firebase/auth'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Alert,
  AlertDescription
} from "@/components/ui/alert"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog"
import { CreateSpaceForm } from './form'

type CreateSpaceProps = {
  user: User
  children?: React.ReactNode
}

export const CreateSpace = ({ user, children }: CreateSpaceProps) => {
  const [isCreating, setCreating] = React.useState(false)
  return (
    <>
      <Alert className='max-w-xl mx-auto text-center'>
        {children}
        <AlertDescription>
          <Button disabled={true} onClick={() => setCreating(true)} className='mt-4'>
            Create a new group
          </Button>
        </AlertDescription>
        <AlertDescription className="bg-muted mt-8 -mx-4 -mb-4 px-4 py-8 text-left">
          <p className="inline-flex gap-2 justify-start">
            <Icons.info />
            <span className="ml-2">Currently the creation of groups is disabled. Come back later.</span>
          </p>
        </AlertDescription>
      </Alert>
      <Dialog open={isCreating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create your first space</DialogTitle>
          </DialogHeader>
          <CreateSpaceForm user={user} onSuccess={() => setCreating(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
