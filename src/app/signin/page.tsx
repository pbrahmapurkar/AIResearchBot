"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

export default function SignInPage() {
  const router = useRouter()
  const search = useSearchParams()
  const next = search.get("redirect") || "/app"
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [forgot, setForgot] = useState(false)
  const [fpEmail, setFpEmail] = useState("")

  const passwordType = showPassword ? "text" : "password"

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function resetErrors() {
    setErrors({})
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    resetErrors()
    const newErrors: Record<string, string> = {}

    if (!username) newErrors.username = 'Username is required'
    if (!email || !emailRegex.test(email)) newErrors.email = 'Invalid email'
    if (!passwordRegex.test(password)) newErrors.password = 'Weak password'
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      toast.error(data.error || 'Signup failed')
    } else {
      toast.success('Account created!')
      // Auto sign in after signup
      const login = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      })
      if (login.ok) {
        router.push(next)
      }
    }
  }

  async function handleSignin(e: React.FormEvent) {
    e.preventDefault()
    resetErrors()
    const newErrors: Record<string, string> = {}
    if (!identifier) newErrors.identifier = 'Email or username required'
    if (!password) newErrors.password = 'Password required'
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }
    setLoading(true)
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, rememberMe: remember }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      toast.error(data.error || 'Login failed')
    } else {
      toast.success('Logged in successfully')
      router.push(next)
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    if (!fpEmail) {
      setErrors({ fpEmail: 'Email is required' })
      return
    }
    setLoading(true)
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: fpEmail }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      toast.error(data.error || 'Request failed')
    } else {
      toast.success(data.message)
      setForgot(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row justify-center gap-4">
          <Button
            variant={mode === 'signin' ? 'default' : 'outline'}
            onClick={() => { setMode('signin'); resetErrors(); }}
          >
            Sign In
          </Button>
          <Button
            variant={mode === 'signup' ? 'default' : 'outline'}
            onClick={() => { setMode('signup'); resetErrors(); }}
          >
            Sign Up
          </Button>
        </CardHeader>
        <CardContent>
          {forgot ? (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                />
                {errors.fpEmail && <p className="text-sm text-red-500">{errors.fpEmail}</p>}
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button variant="link" type="button" onClick={() => { setForgot(false); resetErrors(); }} className="w-full">
                Back to Sign In
              </Button>
            </form>
          ) : mode === 'signup' ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="relative">
                <Input
                  type={passwordType}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-sm">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                {password && !passwordRegex.test(password) && (
                  <p className="text-sm text-red-500">Password must be 8+ chars, include upper, lower, number & special character</p>
                )}
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="relative">
                <Input
                  type={passwordType}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-sm text-red-500">Passwords do not match</p>
                )}
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignin} className="space-y-4">
              <div>
                <Input
                  placeholder="Email or Username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
                {errors.identifier && <p className="text-sm text-red-500">{errors.identifier}</p>}
              </div>
              <div className="relative">
                <Input
                  type={passwordType}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-sm">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded"
                  />
                  <span>Remember me</span>
                </label>
                <button type="button" className="text-sm underline" onClick={() => { setForgot(true); resetErrors(); }}>
                  Forgot password?
                </button>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signIn('google', { callbackUrl: next })}
              >
                Google
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
