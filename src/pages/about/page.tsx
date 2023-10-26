import { Link } from 'react-router-dom'
import { Icons } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const About = () => {
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
            <h3 className="font-mono text-4xl mb-12">About</h3>

            <section className="pb-8">
              <p className="">We host a small movie club with my friends, in our homes. We thought it would be nice to create a small universe, where people can create their own events, invite others to their homes, share their favorite movies with each other, get to know what others like, and get their perspectives tickled every now and then.</p>
            </section>

            <section className="py-8">
              <h4 id="notifications" className="flex gap-2 items-center text-lg mb-8">
                <Icons.bell size={12} />Notifications
              </h4>
              <p className="mb-4">
                <span className="font-mono text-xl">pencilheads</span> uses the <a className="underline inline" target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/notification">Notification API</a> to send notifications to you whenever there's something new to discover, or there's something we need your feedback about.
              </p>

              <p className="mb-4">
                To make sure you're getting the most out of the site, make sure you have everything an up-to-date. You can check <a className="underline" href="https://caniuse.com/?search=Notification">this compatibility matrix</a> to see whether your browser supports receiving notifications.
              </p>


              <h5 className="flex gap-2 items-center mb-4">
                <Icons.monitorSmartphone size={16} />
                <span>On desktops / laptops</span>
              </h5>
              <ul className="mb-4 list-disc pl-3">
                <li>
                  log in to your account
                </li>
                <li>
                  you'll be asked to allow notifications, just click approve
                </li>
                <li>
                  if you've declined once, the site won't ask you again, you'll need to reset your notification settings - typically this can be found on the left of the url bar
                </li>
              </ul>
              <h5 className="flex gap-2 items-center mb-4">
                <Icons.apple width={16} />
                <span>On iOS</span>
              </h5>
              <ul className="mb-4 list-disc pl-3">
                <li>
                  open Safari
                </li>
                <li>
                  tap the <Icons.share size={16} className="inline" />{' '}icon on the bottom of your screen
                </li>
                <li>
                  tap the <span className="font-bold">Add to Home Screen</span> button
                </li>
                <li>
                  pencilheads will be displayed as a normal app on your home screen, where you can open it, and log in to your account
                </li>
                <li>
                  after logging in, enable notifications
                </li>
                <li>
                  if you've declined once, the site won't ask you again, you'll need to reset your notification settings - open your settings and find <span className='font-mono text-lg'>pencilheads</span>, then switch on notifications
                </li>
              </ul>

              <h5 className="inline-flex gap-2 items-center mb-4">
                <Icons.smartPhone size={16} />
                <span>On Android</span>
              </h5>
              <ul className="mb-4 list-disc pl-3">
                <li>
                  open Chrome
                </li>
                <li>
                  tap the <Icons.ellipsis size={12} className="inline" /> icon in the top right corner
                </li>
                <li>
                  click the <span className="font-bold">Add to Home Screen</span> button
                </li>
                <li>
                  pencilheads will be displayed as a normal app on your home screen, where you can open it, and log in to your account
                </li>
                <li>
                  after logging in, enable notifications
                </li>
                <li>
                  if you've declined once, the site won't ask you again, you'll need to reset your notification settings - open your settings and find <span className='font-mono text-lg'>pencilheads</span>, then switch on notifications
                </li>
              </ul>
            </section>
            {/* <section className="py-8">
              <h4 id="notifications" className="flex gap-2 items-center text-lg mb-8">
                <Icons.heartHandshake size={12} />Credits
              </h4>

              <p>I've used some free animations from <a href="https://lottiefiles.com/">Lottifiles</a>, </p>
            </section> */}
          </main>
        </div>
      </div>
    </div>
  )
}
