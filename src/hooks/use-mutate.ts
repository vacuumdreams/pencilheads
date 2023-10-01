import { useState } from 'react';
import { collection, setDoc, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { database } from '@/services/firebase';
import { useToast } from '@/components/ui/use-toast';

type Opts = {
  onSuccess: () => void
  onError?: (error: string) => void
}

database

export function useMutate<T extends object>() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const set = async (id: string, data: T, opts?: Opts) => {
    setLoading(true)
    try {
      await setDoc(doc(database, id), data)
      opts?.onSuccess()
    } catch (err) {
      if (opts?.onError) {
        opts.onError(`${err}`)
      } else {
        toast({
          title: 'Error',
          description: `${err}`,
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
    } catch (err) {
      if (opts?.onError) {
        opts.onError(`${err}`)
      } else {
        toast({
          title: 'Error',
          description: `${err}`,
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
      // await dbremove(ref(realtimeDB, id))
      opts?.onSuccess()
    } catch (err) {
      if (opts?.onError) {
        opts.onError(`${err}`)
      } else {
        toast({
          title: 'Error',
          description: `${err}`,
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
    } catch (err) {
      if (opts?.onError) {
        opts.onError(`${err}`)
      } else {
        toast({
          title: 'Error',
          description: `${err}`,
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return { set, push, remove, update, loading }
}
