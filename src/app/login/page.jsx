'use client'

import { useRouter } from 'next/navigation'
import { sign_in_with_google } from '@/lib/firebase/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()

  async function handle_login() {
    try {
      await sign_in_with_google()
      router.push('/goals')
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <main>
      <h1>Login</h1>
      <Button className="primary" onClick={handle_login}>
        Sign in with Google
      </Button>
    </main>
  )
}
