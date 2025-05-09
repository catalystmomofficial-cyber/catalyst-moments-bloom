
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted/50 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary/20 w-8 h-8 rounded-full flex items-center justify-center">
                <div className="bg-primary w-4 h-4 rounded-full"></div>
              </div>
              <span className="font-bold text-lg">Catalyst<span className="text-primary">Mom</span></span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Empowering women through every stage of motherhood with fitness, nutrition, and community.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li><Link to="/workouts" className="text-sm text-muted-foreground hover:text-primary transition-colors">Workouts</Link></li>
              <li><Link to="/wellness" className="text-sm text-muted-foreground hover:text-primary transition-colors">Wellness</Link></li>
              <li><Link to="/nutrition" className="text-sm text-muted-foreground hover:text-primary transition-colors">Nutrition</Link></li>
              <li><Link to="/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/experts" className="text-sm text-muted-foreground hover:text-primary transition-colors">Experts</Link></li>
              <li><Link to="/research" className="text-sm text-muted-foreground hover:text-primary transition-colors">Research</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Mission</Link></li>
              <li><Link to="/team" className="text-sm text-muted-foreground hover:text-primary transition-colors">Team</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CatalystMom. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span className="text-xs flex items-center text-muted-foreground">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> for moms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
