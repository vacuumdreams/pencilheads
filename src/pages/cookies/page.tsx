import { Link } from "react-router-dom"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const Cookies = () => {
  return (
    <div
      className={cn(
        "bg-background h-screen overflow-y-auto overflow-x-hidden pb-24 pr-0",
        "scrollbar scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-md"
      )}
    >
      <div className="container">
        <div className="mt-12 flex">
          <Link className={cn(buttonVariants(), "flex gap-2")} to="/">
            <Icons.arrowLeft />
            <span>Back</span>
          </Link>
        </div>
        <div className="pt-12 sm:pt-24 md:pt-48">
          <header>
            <h1 className="font-mono text-xl">pencilheads</h1>
          </header>
          <main>
            <h3 className="mb-12 font-mono text-4xl">Cookies and privacy</h3>
            <p>Coming very soon...</p>
          </main>
        </div>
      </div>
    </div>
  )
}
