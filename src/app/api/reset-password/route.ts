import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

export async function POST(request: NextRequest) {
  const { token, password } = await request.json()

  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password required' }, { status: 400 })
  }

  if (!passwordRegex.test(password)) {
    return NextResponse.json({ error: 'Password too weak' }, { status: 400 })
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } })
  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.update({
    where: { id: record.identifier },
    data: { passwordHash },
  })

  await prisma.verificationToken.delete({ where: { token } })

  return NextResponse.json({ message: 'Password reset successful' })
}
