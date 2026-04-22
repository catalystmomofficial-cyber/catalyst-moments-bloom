import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Catalyst Mom'

interface EventConfirmationProps {
  firstName?: string
  lastName?: string
  eventTitle?: string
  eventDate?: string
  eventTime?: string
  instructor?: string
}

const EventConfirmationEmail = ({
  firstName,
  lastName,
  eventTitle,
  eventDate,
  eventTime,
  instructor,
}: EventConfirmationProps) => {
  const fullName = firstName
    ? `${firstName}${lastName ? ` ${lastName}` : ''}`
    : 'there'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        You're registered for {eventTitle ?? 'our upcoming event'} 🎉
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={brand}>{SITE_NAME}</Heading>
            <Text style={tag}>You're registered 🎉</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Hi {fullName},</Heading>
            <Text style={text}>
              Thank you for registering for{' '}
              <strong>{eventTitle ?? 'our event'}</strong>! We can't wait to see
              you there.
            </Text>

            <Section style={detailBox}>
              {eventTitle && (
                <Text style={detailLine}>
                  <strong>Event:</strong> {eventTitle}
                </Text>
              )}
              {eventDate && (
                <Text style={detailLine}>
                  <strong>Date:</strong> {eventDate}
                </Text>
              )}
              {eventTime && (
                <Text style={detailLine}>
                  <strong>Time:</strong> {eventTime}
                </Text>
              )}
              {instructor && (
                <Text style={detailLine}>
                  <strong>Host:</strong> {instructor}
                </Text>
              )}
            </Section>

            <Text style={text}>
              We'll send you a reminder before the event with the access link.
              In the meantime, head over to the community to meet other moms.
            </Text>

            <Text style={footer}>
              With love, the {SITE_NAME} team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: EventConfirmationEmail,
  subject: (data: Record<string, any>) =>
    `You're registered for ${data?.eventTitle ?? 'our event'}`,
  displayName: 'Event registration confirmation',
  previewData: {
    firstName: 'Jane',
    lastName: 'Doe',
    eventTitle: 'Postpartum Recovery Workshop',
    eventDate: 'May 12, 2026',
    eventTime: '10:00 AM EST',
    instructor: 'Dr. Sarah Lin',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
  margin: 0,
  padding: '24px',
}
const container = {
  maxWidth: '560px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden' as const,
  border: '1px solid #ecebe7',
}
const header = {
  background: 'linear-gradient(135deg,#b87333,#8b5a2b)',
  padding: '24px',
  textAlign: 'center' as const,
}
const brand = {
  color: '#ffffff',
  margin: 0,
  fontSize: '22px',
}
const tag = {
  color: '#fde7d3',
  margin: '8px 0 0',
  fontSize: '13px',
}
const content = { padding: '28px' }
const h1 = {
  color: '#2a2a2a',
  margin: '0 0 12px',
  fontSize: '20px',
}
const text = {
  color: '#4a4a4a',
  lineHeight: '1.6',
  margin: '0 0 16px',
  fontSize: '14px',
}
const detailBox = {
  background: '#faf6f1',
  borderLeft: '3px solid #b87333',
  padding: '16px',
  borderRadius: '6px',
  margin: '20px 0',
}
const detailLine = {
  margin: '0 0 6px',
  color: '#2a2a2a',
  fontSize: '14px',
}
const footer = {
  color: '#888',
  fontSize: '12px',
  marginTop: '32px',
}
