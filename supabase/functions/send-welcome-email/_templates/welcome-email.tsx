import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  user_email: string
  display_name?: string
}

export const WelcomeEmail = ({
  user_email,
  display_name,
}: WelcomeEmailProps) => {
  const firstName = display_name || user_email.split('@')[0]
  
  return (
    <Html>
      <Head />
      <Preview>Welcome to Catalyst Mom - Your journey to empowered motherhood starts here! 🌟</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={brandName}>Catalyst Mom</Heading>
            <Text style={tagline}>Empowering Mothers, Every Step of the Way</Text>
          </Section>

          {/* Main content */}
          <Section style={content}>
            <Heading style={h1}>Welcome to Your Journey, {firstName}! 🎉</Heading>
            
            <Text style={text}>
              We're so excited to have you join our community of amazing mothers! You've just taken the first step toward a healthier, stronger, and more empowered you.
            </Text>

            <Text style={sectionTitle}>🌟 What's Waiting for You</Text>

            <Section style={featureBox}>
              <Text style={featureTitle}>💪 Personalized Fitness Plans</Text>
              <Text style={featureText}>
                Tailored workouts for every stage of motherhood - from TTC and pregnancy to postpartum recovery and beyond.
              </Text>
            </Section>

            <Section style={featureBox}>
              <Text style={featureTitle}>🥗 Nutrition Guidance</Text>
              <Text style={featureText}>
                Meal plans, recipes, and nutrition advice designed specifically for mothers' unique needs.
              </Text>
            </Section>

            <Section style={featureBox}>
              <Text style={featureTitle}>👶 Expert Support</Text>
              <Text style={featureText}>
                Access to wellness coaches, pregnancy trackers, and resources for every stage of your journey.
              </Text>
            </Section>

            <Section style={featureBox}>
              <Text style={featureTitle}>💬 Supportive Community</Text>
              <Text style={featureText}>
                Connect with other moms, share experiences, and participate in challenges together.
              </Text>
            </Section>

            <Hr style={divider} />

            <Text style={sectionTitle}>🚀 Getting Started</Text>
            <Text style={text}>Here's how to make the most of your Catalyst Mom experience:</Text>

            <Section style={stepsList}>
              <Text style={step}>1. Complete your profile to get personalized recommendations</Text>
              <Text style={step}>2. Take the journey questionnaire to match your motherhood stage</Text>
              <Text style={step}>3. Explore our workout programs and meal plans</Text>
              <Text style={step}>4. Join community groups that resonate with you</Text>
              <Text style={step}>5. Track your progress and celebrate your wins!</Text>
            </Section>

            <Section style={ctaContainer}>
              <Link
                href="https://catalystmomofficial.com/dashboard"
                style={ctaButton}
              >
                Start Your Journey
              </Link>
            </Section>

            <Hr style={divider} />

            <Text style={sectionTitle}>📋 Community Guidelines</Text>
            <Text style={text}>
              To keep our community supportive and empowering:
            </Text>
            
            <Section style={guidelinesList}>
              <Text style={guideline}>✓ Be kind, supportive, and respectful to all members</Text>
              <Text style={guideline}>✓ Share experiences and celebrate each other's wins</Text>
              <Text style={guideline}>✓ Keep discussions focused on health, wellness, and motherhood</Text>
              <Text style={guideline}>✓ Respect privacy - what's shared in groups stays in groups</Text>
              <Text style={guideline}>✓ Report any concerns to our support team</Text>
            </Section>

            <Hr style={divider} />

            <Text style={text}>
              We're here to support you every step of the way. If you have any questions, don't hesitate to reach out!
            </Text>

            <Text style={signOff}>
              With love and support,<br />
              <strong>The Catalyst Mom Team</strong> 💚
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>
              Catalyst Mom
            </Text>
            <Text style={footerLinks}>
              <Link href="https://catalystmomofficial.com/dashboard" style={link}>
                Dashboard
              </Link>
              {' · '}
              <Link href="https://catalystmomofficial.com/community" style={link}>
                Community
              </Link>
              {' · '}
              <Link href="https://catalystmomofficial.com/faq" style={link}>
                FAQ
              </Link>
              {' · '}
              <Link href="https://catalystmomofficial.com/wellness" style={link}>
                Wellness Coach
              </Link>
            </Text>
            <Text style={copyright}>
              © {new Date().getFullYear()} Catalyst Mom. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

// Styles with Catalyst Mom brand colors
const main = {
  backgroundColor: '#FFF8F0', // cream background
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#C17F45', // copper
  borderRadius: '16px 16px 0 0',
  padding: '32px 24px',
  textAlign: 'center' as const,
}

const brandName = {
  color: '#FFFFFF',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  letterSpacing: '-0.5px',
}

const tagline = {
  color: '#FDE1D3', // peach
  fontSize: '14px',
  margin: '0',
  fontWeight: '400',
}

const content = {
  backgroundColor: '#FFFFFF',
  padding: '40px 32px',
}

const h1 = {
  color: '#5D2906', // brown
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 24px 0',
  lineHeight: '1.3',
}

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const sectionTitle = {
  color: '#5D2906', // brown
  fontSize: '20px',
  fontWeight: '700',
  margin: '32px 0 16px 0',
}

const featureBox = {
  margin: '16px 0',
  padding: '20px',
  backgroundColor: '#FFF8F0', // cream
  borderRadius: '12px',
  borderLeft: '4px solid #C17F45', // copper
}

const featureTitle = {
  color: '#5D2906', // brown
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 8px 0',
}

const featureText = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
}

const stepsList = {
  margin: '16px 0 24px 0',
  padding: '0 0 0 20px',
}

const step = {
  color: '#333333',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '8px 0',
}

const guidelinesList = {
  margin: '16px 0 24px 0',
}

const guideline = {
  color: '#333333',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '8px 0',
}

const ctaContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const ctaButton = {
  backgroundColor: '#C17F45', // copper
  borderRadius: '12px',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 48px',
  boxShadow: '0 4px 12px rgba(193, 127, 69, 0.3)',
}

const divider = {
  borderColor: '#E5D3B3', // tan
  margin: '32px 0',
}

const signOff = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '24px 0 0 0',
}

const footer = {
  backgroundColor: '#F9F0E6', // beige
  borderRadius: '0 0 16px 16px',
  padding: '32px 24px',
  textAlign: 'center' as const,
}

const footerBrand = {
  color: '#5D2906', // brown
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 12px 0',
}

const footerLinks = {
  color: '#666666',
  fontSize: '13px',
  margin: '0 0 16px 0',
}

const link = {
  color: '#C17F45', // copper
  textDecoration: 'none',
  fontWeight: '500',
}

const copyright = {
  color: '#999999',
  fontSize: '12px',
  margin: '0',
}
