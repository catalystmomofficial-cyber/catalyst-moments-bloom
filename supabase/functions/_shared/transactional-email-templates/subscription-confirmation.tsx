import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Catalyst Mom'
const SITE_URL = 'https://catalystmomofficial.com'

interface SubscriptionConfirmationProps {
  firstName?: string
  planName?: string
  amount?: string
  nextBillingDate?: string
}

const SubscriptionConfirmationEmail = ({
  firstName,
  planName = 'Premium Membership',
  amount = '$49.99/month',
  nextBillingDate,
}: SubscriptionConfirmationProps) => {
  const greeting = firstName ? `Welcome, ${firstName}!` : 'Welcome, mama!'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>You're in! Your {SITE_NAME} subscription is active 💛</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{greeting}</Heading>
          <Text style={text}>
            Thank you for subscribing to {SITE_NAME}. Your membership is active and you now have full access to every program, course, and tool inside.
          </Text>

          <Section style={card}>
            <Text style={cardLabel}>YOUR PLAN</Text>
            <Text style={cardValue}>{planName}</Text>
            <Text style={cardLabel}>AMOUNT</Text>
            <Text style={cardValue}>{amount}</Text>
            {nextBillingDate && (
              <>
                <Text style={cardLabel}>NEXT BILLING DATE</Text>
                <Text style={cardValue}>{nextBillingDate}</Text>
              </>
            )}
          </Section>

          <Text style={text}>Here's what's unlocked:</Text>
          <Text style={listItem}>✓ All workout & birth-ball programs</Text>
          <Text style={listItem}>✓ Personalized meal & nutrition plans</Text>
          <Text style={listItem}>✓ Wellness Coach access</Text>
          <Text style={listItem}>✓ Progress tracking & community</Text>

          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button href={`${SITE_URL}/dashboard`} style={button}>
              Go to your dashboard
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={quickStart}>
            <Text style={quickStartLabel}>QUICK START</Text>
            <Text style={quickStartHeading}>Stay Connected</Text>
            <Text style={text}>
              Add Catalyst Mom to your home screen for recovery alerts and daily check-ins.{' '}
              <a href={`${SITE_URL}/pwa-instructions`} style={inlineLink}>
                See how to install
              </a>
              .
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Questions? Just reply to this email — we read every message.
            <br />
            Charges appear as <strong>CATALYST MOM</strong> on your statement.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: SubscriptionConfirmationEmail,
  subject: `Welcome to ${SITE_NAME} — your subscription is active 💛`,
  displayName: 'Subscription confirmation',
  previewData: {
    firstName: 'Sarah',
    planName: 'Premium Membership',
    amount: '$49.99/month',
    nextBillingDate: 'May 28, 2026',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '28px', fontWeight: 'bold', color: '#7c4a2d', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#3f3f46', lineHeight: '1.6', margin: '0 0 16px' }
const listItem = { fontSize: '15px', color: '#3f3f46', lineHeight: '1.8', margin: '0 0 4px' }
const card = {
  backgroundColor: '#fdf6ee',
  border: '1px solid #e8d5bf',
  borderRadius: '12px',
  padding: '20px 24px',
  margin: '20px 0',
}
const cardLabel = { fontSize: '11px', color: '#9c6f4d', letterSpacing: '0.08em', margin: '8px 0 2px' }
const cardValue = { fontSize: '16px', color: '#3f3f46', fontWeight: 600, margin: '0 0 8px' }
const button = {
  backgroundColor: '#b87333',
  color: '#ffffff',
  padding: '14px 28px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-block',
}
const hr = { borderColor: '#e8d5bf', margin: '32px 0 16px' }
const footer = { fontSize: '12px', color: '#71717a', lineHeight: '1.6', textAlign: 'center' as const }
