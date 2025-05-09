
import { Link } from 'react-router-dom';
import { Heart, Mail, Instagram, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
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
            <div className="flex items-center">
              <Button className="rounded-l-md rounded-r-none bg-primary hover:bg-primary/90">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
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
