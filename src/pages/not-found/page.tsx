import { useNavigate } from 'react-router-dom'
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert'
import { Animation } from '@/components/animations'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="fixed top-0 left-0 w-screen h-screen opacity-30">
        <Animation name="white-noise" />
      </div>
      <h1 className="font-mono text-4xl text-center mt-12 mb-16">pencilheads</h1>
      <Alert variant='destructive' className='mt-16 max-w-xl mx-auto text-center'>
        <AlertTitle className='flex gap-2 items-center justify-center mb-4'>
          <Icons.warning width={16} />
          <span>Not found</span>
        </AlertTitle>
        <AlertDescription>
          <p>This page doesn't exist.</p>
          <Button onClick={() => navigate('/')} className='mt-4'>
            Go back
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
