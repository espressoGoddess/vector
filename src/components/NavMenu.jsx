'use client'

import Link from 'next/link'

export default function NavMenu() {
  return (
    <nav className="border-b p-4 flex gap-4 justify-around">
      <Link href="/">Home</Link>
      <Link href="/workouts">Workouts</Link>
      <Link href="/goals">Goals</Link>
    </nav>
  )
}
