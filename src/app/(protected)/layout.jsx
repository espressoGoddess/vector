'use client'

import { UserProvider, useUser } from '@/lib/UserContext'
import NavMenu from '@/components/NavMenu'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

function ProtectedContent({ children }) {
	const user = useUser()
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		if (user === undefined) return

		if (!user) {
			router.replace(`/login?redirect=${pathname}`)
		}
	}, [user, router, pathname])

	if (user === undefined) return <main className="p-12">Loading...</main>
	if (!user) return null

	return (
		<div className="pl-8">
			<NavMenu />
			{children}
		</div>
	)
}

export default function ProtectedLayout({ children }) {
	return (
		<UserProvider>
			<ProtectedContent>{children}</ProtectedContent>
		</UserProvider>
	)
}
