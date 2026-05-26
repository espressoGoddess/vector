'use client'

import { createContext, useContext } from 'react'
import { useAuth } from '@/lib/firebase/useAuth'

const UserContext = createContext(undefined)

export function UserProvider({ children }) {
	const user = useAuth()

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUser() {
	return useContext(UserContext)
}
