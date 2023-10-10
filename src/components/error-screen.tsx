import { FallbackProps } from "react-error-boundary"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Alert,
  AlertTitle,
  AlertDescription
} from "@/components/ui/alert"

export const ErrorScreen = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
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
  )
}
