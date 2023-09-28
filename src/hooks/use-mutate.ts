import { useState } from 'react';
import { ref, set as dbset, remove as dbremove, push as dbpush, update as dbupdate } from 'firebase/database';
import { realtimeDB } from '@/services/firebase';
import { useToast } from '@/components/ui/use-toast';

type Opts = {
  onSuccess: () => void
}

export function useMutate<T extends object>() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const set = async (id: string, data: T, opts?: Opts) => {
    setLoading(true)
    try {
      await dbset(ref(realtimeDB, id), data)
      opts?.onSuccess()
    } catch (err) {
      toast({
        title: 'Error',
        description: `${err}`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const push = async (id: string, data: T, opts?: Opts) => {
    setLoading(true)
    try {
      await dbpush(ref(realtimeDB, id), data)
      opts?.onSuccess()
    } catch (err) {
      toast({
        title: 'Error',
        description: `${err}`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: string, opts?: Opts) => {
    setLoading(true)
    try {
      await dbremove(ref(realtimeDB, id))
      opts?.onSuccess()
    } catch (err) {
      toast({
        title: 'Error',
        description: `${err}`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const update = async (id: string, data: T, opts?: Opts) => {
    setLoading(true)
    try {
      await dbupdate(ref(realtimeDB, id), data)
      opts?.onSuccess()
    } catch (err) {
      toast({
        title: 'Error',
        description: `${err}`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return { set, push, remove, update, loading }
}
