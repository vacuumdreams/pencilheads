import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/services/firebase';
import { Unauthenticated } from './unauthenticated';

type GuardProps = {
  children?: React.ReactNode;
}

export const Guard = ({ children }: GuardProps) => {
  const [user] = useAuthState(auth);

  if (!user) {
    return (<Unauthenticated />)
  }

  return children || <Outlet />
}
