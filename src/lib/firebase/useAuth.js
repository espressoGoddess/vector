'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/firebase'

export function useAuth() {
  const [user, set_user] = useState(undefined)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebase_user) => {
      set_user(firebase_user)
    })

    return () => unsubscribe()
  }, [])

  return user
}
