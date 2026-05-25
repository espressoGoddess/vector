'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutUser } from '@/lib/firebase/auth'
import { Button } from '@/components/ui/button'

export default function NavMenu() {
  const pathname = usePathname()
  return (
    <nav className="sticky top-0 z-50 bg-background">
      <div className="border-b p-4 flex gap-4 justify-around ">
        <Link href="/" className={pathname === '/' ? 'font-semibold border-b-2' : ''}>
          Home
        </Link>

        <Link
          href="/workouts"
          className={pathname === '/workouts' ? 'font-semibold border-b-2' : ''}
        >
          Workouts
        </Link>
        <Link href="/goals" className={pathname === '/goals' ? 'font-semibold border-b-2' : ''}>
          Goals
        </Link>
        <Link href="/coach" className={pathname === '/coach' ? 'font-semibold border-b-2' : ''}>
          Coach
        </Link>

        <Button variant="ghost" onClick={signOutUser}>
          Logout
        </Button>
      </div>
    </nav>
  )
}
