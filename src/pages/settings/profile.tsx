import React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { User } from "firebase/auth"
import { useUpdateProfile } from "react-firebase-hooks/auth"
import { auth } from "@/services/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  name: z.string(),
})

type ProfileFormProps = {
  user: User
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const { toast } = useToast()
  const [mutate, loading, error] = useUpdateProfile(auth)
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user.displayName,
    },
  })

  React.useEffect(() => {
    if (error) {
      console.error(error)
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      })
    }
  }, [error])

  const onSubmit = handleSubmit((data) => {
    mutate({
      displayName: data.name,
    })
  })

  return (
    <div>
      <p className="mb-2 text-base">Your name</p>
      <form className="grid w-full gap-4" onSubmit={onSubmit}>
        <Input {...register("name", { required: true })} />
        <div className="flex">
          <Button
            disabled={loading && formState.isValid && !formState.isDirty}
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}
