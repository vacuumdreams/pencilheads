import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Animation } from '@/components/animations'
import {
  Alert,
  AlertTitle,
  AlertDescription
} from "@/components/ui/alert"

type Props = {
  error: any
  resetErrorBoundary: () => void
}

export const ErrorScreen = ({ error, resetErrorBoundary }: Props) => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-screen h-screen opacity-30">
        <Animation name="white-noise" />
      </div>
      <div className="flex justify-center">
        <Animation name="confused-pencil" className="w-32" />
      </div>
      <h1 className="font-mono text-4xl text-center mt-12 mb-16">pencilheads</h1>
      <Alert variant='destructive' className='mt-16 max-w-xl mx-auto text-center'>
        <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
          <Icons.warning width={16} />
          <span>Error</span>
        </AlertTitle>
        <AlertDescription>
          <p>{`${error}`}</p>
          <Button onClick={() => resetErrorBoundary()} className='mt-4'>
            Reload
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
