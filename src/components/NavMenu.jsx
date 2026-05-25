'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavMenu() {
  const pathname = usePathname()
  return (
    <nav className="border-b p-4 flex gap-4 justify-around sticky top-0 z-50 bg-background">
      <Link href="/" className={pathname === '/' ? 'font-semibold border-b-2' : ''}>
        Home
      </Link>

      <Link href="/workouts" className={pathname === '/workouts' ? 'font-semibold border-b-2' : ''}>
        Workouts
      </Link>
      <Link href="/goals" className={pathname === '/goals' ? 'font-semibold border-b-2' : ''}>
        Goals
      </Link>
      <Link href="/coach" className={pathname === '/coach' ? 'font-semibold border-b-2' : ''}>
        Coach
      </Link>
    </nav>
  )
}
