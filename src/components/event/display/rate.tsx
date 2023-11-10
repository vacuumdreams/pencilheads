import React from "react"
import { useForm, Controller } from "react-hook-form"
import { Transition } from "react-transition-group"
import { User } from "firebase/auth"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/tag"
import { Icons } from "@/components/icons"
import { useMutate } from "@/hooks/use-mutate"
import { useSpaceId } from "@/hooks/use-space"
import { useToast } from "@/components/ui/use-toast"
import { Event } from "@/types"
import { cn } from "@/lib/utils"

type RateProps = {
  id: string
  user?: User
  event: Event
}

const getRateText = (num: number) => {
  if (num > 90) {
    return "It's one of my favourites now ❤️"
  }
  if (num > 80) {
    return "I loved it, it has blown me away 😍"
  }
  if (num > 70) {
    return "It was really good, I enjoyed it 🥰"
  }
  if (num > 60) {
    return "It was fine, I think I liked it 😊"
  }
  if (num > 50) {
    return "It was a decent film, I kind of have mixed feelings about it 🙂"
  }
  if (num > 40) {
    return "It was an okay movie. Not sure if I would watch it again 😐"
  }
  if (num > 30) {
    return "I didn't enjoy it much, wouldn't necessary recommend it 😕"
  }
  if (num > 20) {
    return "Meh, I didn't like it at all 😒"
  }
  if (num > 10) {
    return "What the hell did they just made me watch? 😔"
  }

  return "The worst thing I've ever seen, disappointing ⛔"
}

const getRatedText = (user?: User, event: Event) => {
  const ratings = Object.values(event.rating || {})
  const num = getAvgRating(ratings)

  if (ratings.length === 0) {
    return "No one has rated this movie yet"
  }

  if (ratings.length > 1) {
    if (num > 90) {
      return "It's most people's favourite movie ❤️"
    }
    if (num > 80) {
      return "People were blown away by this movie 😍"
    }
    if (num > 70) {
      return "Most people really enjoyed the movie 🥰"
    }
    if (num > 60) {
      return "Most people thought it was fine and liked the movie 😊"
    }
    if (num > 50) {
      return "Most people were not exactly convinced by this movie 🙂"
    }
    if (num > 40) {
      return "Most people probably wouldn't watch the movie again 😐"
    }
    if (num > 30) {
      return "Most people wouldn't recommend the movie 😕"
    }
    if (num > 20) {
      return "Most people didn't like the movie 😒"
    }
    if (num > 10) {
      return "Most people really didn't like the movie 😔"
    }

    return "Most people found the movie very disappointing ⛔"
  }

  if (user?.uid && !!event.rating?.[user.uid]) {
    if (num > 90) {
      return "It's your favourite ❤️"
    }
    if (num > 80) {
      return "You were blown away by this movie 😍"
    }
    if (num > 70) {
      return "You really enjoyed the movie 🥰"
    }
    if (num > 60) {
      return "You thought the movie was fine 😊"
    }
    if (num > 50) {
      return "You were not exactly convinced by this movie 🙂"
    }
    if (num > 40) {
      return "You probably wouldn't watch the movie again 😐"
    }
    if (num > 30) {
      return "You would not recommend the movie 😕"
    }
    if (num > 20) {
      return "You didn't really like the movie 😒"
    }
    if (num > 10) {
      return "You really didn't like the movie 😔"
    }

    return "You found the movie very disappointing ⛔"
  }

  if (num > 90) {
    return "It's one person's favourite ❤️"
  }
  if (num > 80) {
    return "A person was blown away by this movie 😍"
  }
  if (num > 70) {
    return "A person really enjoyed the movie 🥰"
  }
  if (num > 60) {
    return "One person thought the movie was fine 😊"
  }
  if (num > 50) {
    return "One person was not exactly convinced by this movie 🙂"
  }
  if (num > 40) {
    return "A person probably wouldn't watch the movie again 😐"
  }
  if (num > 30) {
    return "One person would not recommend the movie 😕"
  }
  if (num > 20) {
    return "One person didn't really like the movie 😒"
  }
  if (num > 10) {
    return "One person really didn't like the movie 😔"
  }

  return "One person found the movie very disappointing ⛔"
}

const getAvgRating = (ratings: number[]) => {
  return Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length)
}

export const Rate = ({ user, id, event }: RateProps) => {
  const spaceId = useSpaceId()
  const { toast } = useToast()
  const formRef = React.useRef(null)
  const messageRef = React.useRef(null)
  const statsRef = React.useRef(null)
  const { update, loading } = useMutate<Partial<Event>>("event")
  const { control, handleSubmit, formState } = useForm<{ rate: number }>({
    defaultValues: {
      rate: (user && event.rating?.[user.uid]) || 70,
    },
  })

  const shouldSubmitRating =
    user && event.attendance[user.uid] && !event.rating?.[user.uid]

  const ratings = Object.values(event.rating || {})
  const avg = getAvgRating(ratings)

  const onSubmit = handleSubmit(async (data) => {
    if (user) {
      await update(
        `/events/${spaceId}/events/${id}`,
        {
          rating: {
            ...event.rating,
            [user.uid]: data.rate,
          },
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Thank you for your feedback!",
              variant: "default",
            })
          },
        }
      )
    } else {
      toast({
        title: "Error",
        description: "You need to be logged in to rate this event",
        variant: "destructive",
      })
    }
  })

  return (
    <div
      className={cn(
        "-mx-4 grid px-4 pb-4 pt-4 text-left transition-colors duration-200",
        {
          "bg-green-900": shouldSubmitRating,
        }
      )}
    >
      <Transition nodeRef={statsRef} in={!shouldSubmitRating} timeout={300}>
        {(state) => (
          <div
            ref={statsRef}
            className={cn(
              "col-span-full row-span-full flex w-full items-center justify-between gap-2 py-2",
              {
                "opacity-0": ["exiting", "exited"].includes(state),
                "opacity-100": ["entering", "entered"].includes(state),
                hidden: state === "exited",
              }
            )}
          >
            <p className="text-muted-foreground">{getRatedText(user, event)}</p>
            {ratings.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground text-xs">
                  {ratings.length} votes
                </span>
                <Tag>{avg}/100</Tag>
              </div>
            )}
          </div>
        )}
      </Transition>
      <Transition nodeRef={formRef} in={shouldSubmitRating} timeout={300}>
        {(state) => (
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className={cn(
              "col-span-full row-span-full w-full transition-opacity duration-200",
              {
                "opacity-0": ["exiting", "exited"].includes(state),
                "opacity-100": ["entering", "entered"].includes(state),
                hidden: state === "exited",
              }
            )}
          >
            <h5>How did you like the movie?</h5>
            <Controller
              name="rate"
              control={control}
              render={({ field }) => (
                <div>
                  <p className="text-muted-foreground text-right">
                    {field.value}/100
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        field.onChange(Math.max(0, field.value - 10))
                      }
                    >
                      <Icons.thumbsDown />
                    </button>
                    <Slider
                      value={[field.value]}
                      max={100}
                      step={1}
                      onValueChange={([value]) => {
                        field.onChange(value)
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        field.onChange(Math.min(100, field.value + 10))
                      }
                    >
                      <Icons.thumbsUp />
                    </button>
                  </div>
                  <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-center sm:text-left">
                      {getRateText(field.value)}
                    </p>
                    <Button disabled={loading} type="submit">
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            />
          </form>
        )}
      </Transition>
    </div>
  )
}
