'use client'

import { useRouter } from 'next/navigation'
import { signInWithGoogle } from '@/lib/firebase/auth'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()

  async function handleLogin() {
    try {
      await signInWithGoogle()
      router.push('/goals')
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <main>
      <h1>Login</h1>
      <Button className="primary" onClick={handleLogin}>
        Sign in with Google
      </Button>
    </main>
  )
}
