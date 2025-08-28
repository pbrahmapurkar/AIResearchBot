'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, signUpSchema, type SignInSchema, type SignUpSchema } from '@/lib/validation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function AuthPage() {
  const search = useSearchParams()
  const next = search.get('next') || '/app'

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm redirect={next} />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm redirect={next} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}

function SignInForm({ redirect }: { redirect: string }) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { remember: true },
  })

  async function onSubmit(values: SignInSchema) {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (res.ok) {
      router.push(redirect)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="emailOrUsername">Email or Username</Label>
        <Input id="emailOrUsername" {...register('emailOrUsername')} />
        {errors.emailOrUsername && (
          <p className="text-sm text-red-500">{errors.emailOrUsername.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <input id="remember" type="checkbox" {...register('remember')} />
        <Label htmlFor="remember">Remember me</Label>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}

function SignUpForm({ redirect }: { redirect: string }) {
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const username = watch('username')
  const email = watch('email')
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    if (username) {
      fetch(`/api/validate/username?u=${username}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((d) => setUsernameAvailable(d.available))
        .catch(() => {})
    }
    return () => controller.abort()
  }, [username])

  useEffect(() => {
    const controller = new AbortController()
    if (email) {
      fetch(`/api/validate/email?e=${email}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((d) => setEmailAvailable(d.available))
        .catch(() => {})
    }
    return () => controller.abort()
  }, [email])

  async function onSubmit(values: SignUpSchema) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (res.ok) {
      router.push(redirect)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register('username')} />
        {usernameAvailable === false && (
          <p className="text-sm text-red-500">Username taken</p>
        )}
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} />
        {emailAvailable === false && (
          <p className="text-sm text-red-500">Email in use</p>
        )}
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting || usernameAvailable === false || emailAvailable === false}>
        {isSubmitting ? 'Creating...' : 'Sign Up'}
      </Button>
    </form>
  )
}
