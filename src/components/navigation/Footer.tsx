
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: "Successfully subscribed! ✨",
        description: "Check your email for a welcome message.",
        duration: 5000,
      });
      setEmail('');
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-white/40"
          disabled={isLoading}
          required
        />
        <Button 
          type="submit" 
          variant="outline" 
          size="icon"
          className="border-white/20 text-white hover:bg-white/10 flex-shrink-0"
          disabled={isLoading}
        >
          <Mail className="h-4 w-4" />
        </Button>
      </div>
      {isLoading && (
        <p className="text-xs text-gray-300">Subscribing...</p>
      )}
    </form>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/46dafd82-4029-4af8-b259-7df82cdfa99c.png" 
                alt="Catalyst Mom Logo" 
                className="h-10 w-10"
              />
              <span className="font-bold text-xl text-catalyst-brown">Catalyst<span className="text-catalyst-copper">Mom</span></span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Empowering women through every stage of motherhood with fitness, nutrition, and community support.
            </p>
            
            <div className="mt-6 flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-9 w-9" 
                aria-label="Instagram"
                asChild
              >
                <a 
                  href="https://www.instagram.com/catalyst_mom/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-9 w-9" 
                aria-label="Pinterest"
                asChild
              >
                <a 
                  href="https://www.pinterest.com/catalystmoms/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.99-5.373 11.99-12C24 5.372 18.627.001 12.001.001z"/>
                  </svg>
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-9 w-9" 
                aria-label="Facebook"
                asChild
              >
                <a 
                  href="https://www.facebook.com/profile.php?viewas=100000686899395&id=61554306726027" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-primary mb-4">Features</h3>
            <ul className="space-y-3">
              <li><Link to="/workouts" className="text-sm text-muted-foreground hover:text-primary transition-colors">Workouts</Link></li>
              <li><Link to="/wellness" className="text-sm text-muted-foreground hover:text-primary transition-colors">Wellness</Link></li>
              <li><Link to="/nutrition" className="text-sm text-muted-foreground hover:text-primary transition-colors">Nutrition</Link></li>
              <li><Link to="/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-primary mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/experts" className="text-sm text-muted-foreground hover:text-primary transition-colors">Experts</Link></li>
              <li><Link to="/research" className="text-sm text-muted-foreground hover:text-primary transition-colors">Research</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-primary mb-4">Subscribe</h3>
            <p className="text-sm text-muted-foreground mb-4">Join our newsletter for tips, events, and updates.</p>
            <NewsletterSubscription />
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CatalystMom. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span className="text-xs flex items-center text-muted-foreground">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500 animate-pulse-soft" /> for moms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
