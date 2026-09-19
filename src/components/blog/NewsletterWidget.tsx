import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Check, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface NewsletterWidgetProps {
  interest?: string;
  source?: string;
  articleSlug?: string;
}

export const NewsletterWidget = ({ interest = 'general', source = 'blog', articleSlug }: NewsletterWidgetProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { email: email.trim(), interest, source, articleSlug }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setSubscribed(true);
      setEmail('');
      toast.success('You’re subscribed. Welcome to Catalyst Mom!');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-primary">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">You're subscribed!</p>
              <p className="text-sm text-muted-foreground">Welcome to our community</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-background/50 flex items-start gap-2">
            <Bell className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Look out for articles, practical guides and updates matched to your interests.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Stay Updated</CardTitle>
        </div>
        <CardDescription>
          Get new articles, practical guides and occasional Catalyst Mom offers in your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
          <Input
            type="email"
            aria-label="Email address"
            required
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">
          {interest === 'general' ? 'Updates across all topics.' : `Updates about ${interest === 'ttc' ? 'TTC' : interest}.`} Unsubscribe anytime. <Link to="/privacy" className="underline">Privacy Policy</Link>
        </p>
      </CardContent>
    </Card>
  );
};
