'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { signOutUser } from '@/lib/firebase/auth'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet'

const links = [
  { href: '/', label: 'Home' },
  { href: '/workouts', label: 'Workouts' },
  { href: '/goals', label: 'Goals' },
  { href: '/coach', label: 'Coach' },
]

export default function NavMenu() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background p-4">
      <div className="flex items-center">
        <Link href="/" className="font-semibold mr-10">
          Vector
        </Link>

        <div className="hidden flex-1 items-center justify-center sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mx-8 ${pathname === link.href ? 'font-semibold border-b-2' : ''}`}
            >
              {link.label}
            </Link>
          ))}

          <Button variant="ghost" onClick={signOutUser} className="ml-4">
            Logout
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto sm:hidden">
              <Menu className="size-8" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="text-xl ml-8">Menu</SheetTitle>
              <SheetDescription className="hidden">navigate</SheetDescription>
            </SheetHeader>

            <div className="mt-8 flex flex-col text-center">
              {links.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className={`block w-full rounded-md p-4 text-2xl my-5 ${
                      pathname === link.href ? 'font-semibold bg-muted' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}

              <SheetClose asChild>
                <Button variant="ghost" onClick={signOutUser} className="p-8 my-5 text-2xl">
                  Logout
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
