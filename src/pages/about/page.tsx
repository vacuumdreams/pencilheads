import { Link } from 'react-router-dom'
import { Icons } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const About = () => {
  return (
    <div className="container">
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
          <h3 className="font-mono text-4xl mb-12">About</h3>
          <p>coming very soon...</p>
        </main>
      </div>
    </div>
  )
}
