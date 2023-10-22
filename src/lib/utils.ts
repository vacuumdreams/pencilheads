import { clsx, type ClassValue } from "clsx"
import { User as AuthUser } from "firebase/auth"
import { twMerge } from "tailwind-merge"
import { User } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export const isValidEmail = (email: string) =>
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

export const getUserName = (user?: AuthUser | null) => {
  return user?.displayName || user?.email?.split('@')[0] || ''
}

export const getUser = (user: AuthUser): User => {
  return {
    uid: user.uid,
    email: user.email || '',
    name: getUserName(user),
    photoUrl: user.photoURL || null,
  }
}

export const getDbErrorMessage = (resourceName: string, error?: any) => {
  if (!error) {
    return null
  }
  console.error(error)
  switch (error.code) {
    case 'not-found': return `Could not find ${resourceName}.`
    case 'permission-denied': return `You do not have permission to access ${resourceName}.`
    default: return `An error occurred while accessing ${resourceName}.`
  }
}
