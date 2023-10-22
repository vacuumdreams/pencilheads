import { Link } from 'react-router-dom'
import { Icons } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Cookies = () => {
  return (
    <div
      className={cn(
        "h-screen overflow-x-hidden overflow-y-auto bg-background pb-24 pr-0",
        "scrollbar scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-md"
      )}
    >
      <div className='container'>
        <div className="flex mt-12">
          <Link className={cn(buttonVariants(), 'flex gap-2')} to="/">
            <Icons.arrowLeft />
            <span>Back</span>
          </Link>
        </div>
        <div className="pt-12 sm:pt-24 md:pt-48">
          <header>
            <h1 className="font-mono text-xl">pencilheads</h1>
          </header>
          <main>
            <h3 className="font-mono text-4xl mb-12">Cookies and privacy</h3>
            <p>coming very soon...</p>
          </main>
        </div>
      </div>
    </div>
  )
}
