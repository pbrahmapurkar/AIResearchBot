import { PrismaAdapter } from "@next-auth/prisma-adapter"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url)
        // Import the email template
        const { render } = await import("@react-email/render")
        const { default: MagicLinkEmail } = await import("@/emails/MagicLinkEmail")
        
        const html = await render(MagicLinkEmail({ 
          loginUrl: url, 
          email: identifier,
          host 
        }))
        
        const text = `Sign in to ${host}\n\nClick here to sign in: ${url}\n\nIf you didn't request this, please ignore this email.`

        const nodemailer = await import("nodemailer")
        const transport = nodemailer.createTransport({
          host: provider.server.host,
          port: provider.server.port,
          auth: provider.server.auth,
        })

        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Your sign-in link for ${host}`,
          text,
          html,
        })
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-request",
    error: "/signin",
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user }: any) {
      if (session?.user && user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = user.id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).role = (user as any).role || 'VIEWER'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).orgId = (user as any).orgId
        
        // Update last seen
        await prisma.user.update({
          where: { id: user.id },
          data: { lastSeenAt: new Date() }
        })
      }
      return session
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async redirect({ url, baseUrl }: any) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/app/projects`
    },
  },
  session: {
    strategy: "database" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
