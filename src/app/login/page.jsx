'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithGoogle } from '@/lib/firebase/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleLogin() {
    try {
      await signInWithGoogle()
      const redirect = searchParams.get('redirect') || '/goals'
      router.push(redirect)
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Vector</h1>
        <p className="text-muted-foreground mt-2">Track your fitness journey</p>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleLogin}>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
