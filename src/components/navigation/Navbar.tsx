
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <img 
            src="/lovable-uploads/46dafd82-4029-4af8-b259-7df82cdfa99c.png" 
            alt="Catalyst Mom Logo" 
            className="h-10 w-10 object-contain"
          />
          <span className="font-bold text-xl text-catalyst-brown">Catalyst<span className="text-catalyst-copper">Mom</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={cn("hidden md:flex items-center space-x-8")}>
          <NavLinks closeMenu={closeMenu} currentPath={location.pathname} />
        </nav>
        
        {/* User actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="hidden md:flex rounded-full" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden md:flex rounded-full" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hidden md:flex border-primary/20"
                aria-label="User menu"
              >
                <User className="h-5 w-5 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant={scrolled ? "outline" : "ghost"}
            size="icon"
            className={cn(
              "md:hidden rounded-full",
              scrolled ? "border-primary/20" : "text-primary"
            )}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md animate-fade-in">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-5">
            <NavLinks closeMenu={closeMenu} currentPath={location.pathname} />
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <Button variant="outline" className="w-full" onClick={closeMenu}>
                <User className="mr-2 h-4 w-4" /> Profile
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const NavLinks = ({ closeMenu, currentPath }: { closeMenu: () => void, currentPath: string }) => {
  const links = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/workouts", label: "Workouts" },
    { path: "/wellness", label: "Wellness" },
    { path: "/community", label: "Community" },
  ];
  
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={cn(
            "relative font-medium transition-colors duration-200",
            currentPath === link.path 
              ? "text-catalyst-copper after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-catalyst-copper after:left-0 after:bottom-[-4px]" 
              : "text-foreground/70 hover:text-catalyst-copper"
          )}
          onClick={closeMenu}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};

export default Navbar;
