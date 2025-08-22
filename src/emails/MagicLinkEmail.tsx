import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

interface MagicLinkEmailProps {
  loginUrl: string
  email: string
  host: string
}

export default function MagicLinkEmail({
  loginUrl,
  email,
  host,
}: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your sign-in link for Mister PB</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Heading style={logoText}>Mister PB</Heading>
            <Text style={tagline}>AI-Powered Consumer Insights</Text>
          </Section>
          
          <Section style={section}>
            <Heading style={h1}>Sign in to Mister PB</Heading>
            <Text style={text}>
              Hi there! We received a request to sign in to your Mister PB account using this email address:
            </Text>
            <Text style={emailText}>{email}</Text>
            <Text style={text}>
              Click the button below to securely sign in. This link will expire in 15 minutes for your security.
            </Text>
            
            <Button style={button} href={loginUrl}>
              Sign in to Mister PB
            </Button>
            
            <Text style={text}>
              Or copy and paste this URL into your browser:
            </Text>
            <Link href={loginUrl} style={link}>
              {loginUrl}
            </Link>
          </Section>
          
          <Section style={footer}>
            <Text style={footerText}>
              If you didn&apos;t request this email, you can safely ignore it. 
              This sign-in link was intended for {email}.
            </Text>
            <Text style={footerText}>
              Best regards,<br />
              The Mister PB Team
            </Text>
            <Text style={footerText}>
              This email was sent from {host}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const logoSection = {
  padding: "32px 40px",
  textAlign: "center" as const,
  borderBottom: "1px solid #e6ebf1",
}

const logoText = {
  color: "#0ea5e9",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0 0 8px 0",
}

const tagline = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
}

const section = {
  padding: "24px 40px",
}

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "32px",
  margin: "0 0 20px 0",
}

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px 0",
}

const emailText = {
  color: "#0ea5e9",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px 0",
}

const button = {
  backgroundColor: "#0ea5e9",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
  margin: "24px 0",
}

const link = {
  color: "#0ea5e9",
  fontSize: "14px",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
}

const footer = {
  padding: "24px 40px",
  borderTop: "1px solid #e6ebf1",
}

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 12px 0",
}
