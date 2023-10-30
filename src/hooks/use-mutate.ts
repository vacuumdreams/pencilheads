import { useState } from 'react';
import {
  collection,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { database } from '@/services/firebase';
import { useToast } from '@/components/ui/use-toast';
import { getDbErrorMessage } from '@/lib/utils';

type Opts = {
  onSuccess: () => void
  onError?: (error: string) => void
}

export function useMutate<T extends object>(namespace: string) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const set = async (id: string, data: T, opts?: Opts) => {
    setLoading(true)
    try {
      await setDoc(doc(database, id), data)
      opts?.onSuccess()
    } catch (error) {
      const errorMessage = getDbErrorMessage(namespace, error)
      if (opts?.onError) {
        opts.onError(`${errorMessage}`)
      } else {
        toast({
          title: 'Error',
          description: `${errorMessage}`,
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const push = async (id: string, data: T, opts?: Opts) => {
    setLoading(true)
    try {
      await addDoc(collection(database, id), data)
      opts?.onSuccess()
    } catch (error) {
      const errorMessage = getDbErrorMessage(namespace, error)
      if (opts?.onError) {
        opts.onError(`${errorMessage}`)
      } else {
        toast({
          title: 'Error',
          description: `${errorMessage}`,
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: string, opts?: Opts) => {
    setLoading(true)
    try {
      await deleteDoc(doc(database, id))
      opts?.onSuccess()
    } catch (error) {
      const errorMessage = getDbErrorMessage(namespace, error)
      if (opts?.onError) {
        opts.onError(`${errorMessage}`)
      } else {
        toast({
          title: 'Error',
          description: `${errorMessage}`,
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const update = async (id: string, data: T, opts?: Opts) => {
    setLoading(true)
    try {
      await updateDoc(doc(database, id), data)
      opts?.onSuccess()
    } catch (error) {
      const errorMessage = getDbErrorMessage(namespace, error)
      if (opts?.onError) {
        opts.onError(`${errorMessage}`)
      } else {
        toast({
          title: 'Error',
          description: `${errorMessage}`,
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return { set, push, remove, update, loading }
}
