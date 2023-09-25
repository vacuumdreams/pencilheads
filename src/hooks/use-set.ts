import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { realtimeDB } from '@/services/firebase';

export function useSet<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const mutate = async (id: string, data: T) => {
    try {
      await set(ref(realtimeDB, id), data)
    } catch (err) {
      setError(`${err}`)
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}
