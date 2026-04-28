
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Crown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AuthLinks from './AuthLinks';
import { NotificationSystem } from '@/components/notifications/NotificationSystem';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { subscribed, subscriptionTier } = useAuth();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Progress', href: '/progress' },
    { name: 'Workouts', href: '/workouts' },
    { name: 'Recipes', href: '/recipes' },
    { name: 'Wellness', href: '/wellness' },
    { name: 'Community', href: '/community' },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-muted">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl text-catalyst-copper">Catalyst Mom</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {links.map(link => (
              <Link
                key={link.name}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-2"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Links + Notifications - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {subscribed && (
              <Link to="/profile" aria-label="Manage subscription">
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-catalyst-gold/20 to-catalyst-copper/20 text-catalyst-brown border border-catalyst-gold/40 hover:from-catalyst-gold/30 hover:to-catalyst-copper/30 transition-colors gap-1 px-2.5 py-1"
                >
                  <Crown className="h-3.5 w-3.5" />
                  {subscriptionTier || 'Premium'} Member
                </Badge>
              </Link>
            )}
            <NotificationSystem />
            <AuthLinks />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pt-10">
                <nav className="flex flex-col space-y-4">
                  {links.map(link => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-foreground px-2 py-2 rounded-md hover:bg-muted transition-colors font-medium"
                      onClick={closeMenu}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t space-y-3">
                    {subscribed && (
                      <Badge
                        variant="secondary"
                        className="w-full justify-center bg-gradient-to-r from-catalyst-gold/20 to-catalyst-copper/20 text-catalyst-brown border border-catalyst-gold/40 gap-1 py-1.5"
                      >
                        <Crown className="h-3.5 w-3.5" />
                        {subscriptionTier || 'Premium'} Member — Active
                      </Badge>
                    )}
                    <AuthLinks />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
