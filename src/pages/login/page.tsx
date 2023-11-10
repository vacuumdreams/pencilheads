import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/services/firebase"
import { Unauthenticated } from "@/components/auth/unauthenticated"

export const Login = () => {
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard")
    }
  }, [navigate, user, loading])

  return <Unauthenticated />
}
