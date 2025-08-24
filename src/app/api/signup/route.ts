import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

export async function POST(request: NextRequest) {
  const { username, email, password, confirmPassword } = await request.json()

  if (!username || !email || !password || !confirmPassword) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
  }

  if (!passwordRegex.test(password)) {
    return NextResponse.json({ error: 'Password too weak' }, { status: 400 })
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  })

  if (existingUser) {
    return NextResponse.json({ error: 'Username or email already taken' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { username, email, passwordHash },
  })

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  })

  const response = NextResponse.json({
    user: { id: user.id, username: user.username, email: user.email },
  })
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
