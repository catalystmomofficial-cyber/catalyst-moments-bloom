import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Img,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface BlogNotificationEmailProps {
  title: string;
  excerpt: string;
  featured_image_url?: string;
  slug: string;
  site_url: string;
  unsubscribe_url: string;
}

export const BlogNotificationEmail = ({
  title,
  excerpt,
  featured_image_url,
  slug,
  site_url,
  unsubscribe_url,
}: BlogNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>{excerpt}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Blog Post from Catalyst Mom</Heading>
        
        {featured_image_url && (
          <Img
            src={featured_image_url}
            alt={title}
            style={image}
          />
        )}
        
        <Heading style={h2}>{title}</Heading>
        
        <Text style={text}>{excerpt}</Text>
        
        <Link
          href={`${site_url}/blog/${slug}`}
          target="_blank"
          style={button}
        >
          Read Full Article
        </Link>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          You're receiving this email because you subscribed to Catalyst Mom newsletter.
          <br />
          <Link
            href={`${site_url}`}
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Visit Catalyst Mom
          </Link>
          {' · '}
          <Link
            href={unsubscribe_url}
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Unsubscribe
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default BlogNotificationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 16px',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const image = {
  width: '100%',
  maxWidth: '600px',
  height: 'auto',
  margin: '0 auto',
};

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px',
  margin: '24px 40px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
};

const link = {
  color: '#5469d4',
  textDecoration: 'underline',
};
