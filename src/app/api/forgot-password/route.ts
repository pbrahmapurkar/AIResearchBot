import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    // Don't reveal that user doesn't exist
    return NextResponse.json({ message: 'If that email exists, a reset link was sent' })
  }

  const token = crypto.randomUUID()
  await prisma.verificationToken.create({
    data: {
      identifier: user.id,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    },
  })

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Reset your password',
      text: `Reset your password using this link: ${resetLink}`,
    })
  } catch (e) {
    console.error('Email error', e)
  }

  return NextResponse.json({ message: 'If that email exists, a reset link was sent' })
}
