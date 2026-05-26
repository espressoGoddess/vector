'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/firebase'

export function useAuth() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebase_user) => {
      setUser(firebase_user)
    })

    return () => unsubscribe()
  }, [])

  return user
}
