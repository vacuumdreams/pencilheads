import React from 'react'
import { NavLink } from 'react-router-dom'
import { Transition } from 'react-transition-group'
import { Typewriter } from 'react-simple-typewriter'
import { Icons } from '@/components/icons'
import { Animation } from '@/components/animations'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const linkClass = buttonVariants({
  variant: 'default',
  size: 'lg'
})

const captions = [
  'host your events',
  'meet new friends',
  'discover events around you',
  'organise your movie club',
]

const Captions = () => {
  return (
    <span className="text-green-800 dark:text-green-300">
      <Typewriter
        words={captions}
        typeSpeed={70}
        deleteSpeed={20}
        delaySpeed={2000}
        cursor
      />
    </span>
  )
}

export const Home = () => {
  const nodeRef = React.useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 1000)
  }, [])

  return (
    <div className="relative flex w-screen h-screen justify-center items-center">
      <div
        className="overflow-hidden w-full h-full left-1/2 top-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 dark:bg-black"
        style={{
          animation: 'tvSwitch 0.5s cubic-bezier(0.32, 0.70, 0.58, 1)',
          animationPlayState: !loaded ? 'running' : 'paused',
        }}
      >
        <div className="fixed top-0 left-0 w-screen h-screen opacity-20 dark:opacity-30">
          <Animation name="white-noise" />
        </div>
      </div>
      <Transition in={loaded} nodeRef={nodeRef} timeout={500}>
        {state => (
          <div ref={nodeRef} className={cn('relative z-2 p-2 transition-opacity duration-1000', {
            'opacity-0': state === 'exited',
            'opacity-100': state === 'entered',
          })}>
            <main className="pb-48 text-center">
              <h1 className="font-mono text-6xl sm:text-8xl md:text-9xl mb-12">pencilheads</h1>
              <p className="mb-6">a place to <Captions /></p>
              <NavLink to="/dashboard" className={linkClass}>Get started</NavLink>
            </main>
            <footer className="fixed bg-transparent gap-x-4 px-2 sm:px-4 bottom-0 left-0 w-full flex justify-end mt-auto">
              <NavLink to="/cookies" className="inline-flex items-center gap-1 ml-2">
                <Icons.cookie width={12} />
                <span>privacy</span>
              </NavLink>
              <a className="inline-flex items-center gap-1 ml-2" href="mailto:info@pencilheads.net">
                <Icons.mail width={12} />
                <span>contact</span>
              </a>
            </footer>
          </div>
        )}
      </Transition>
    </div>
  )
}
