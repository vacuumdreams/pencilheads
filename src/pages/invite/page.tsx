import React from 'react'
import { Navigate } from "react-router-dom";
import { LottieRefCurrentProps } from 'lottie-react'
import { Transition } from 'react-transition-group'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/services/firebase'
import { cn } from '@/lib/utils'
import { Animation } from '@/components/animations'

export const Invite = () => {
  const childRef = React.useRef(null)
  const animationRef = React.useRef<LottieRefCurrentProps>(null);
  const [user, loading, error] = useAuthState(auth);

  if (user) {
    return (
      <Navigate to="/" replace={true} />
    )
  }

  return (
    <Transition
      nodeRef={childRef}
      in={!loading}
      timeout={300}
    >
      {state => (
        <div ref={childRef}>
          <div className={cn()}>
            <Animation lottieRef={animationRef} name='pencilhead' />
          </div>
        </div>
      )}
    </Transition>
  )
}
