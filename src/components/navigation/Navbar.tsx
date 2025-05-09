
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <div className="bg-primary/20 w-10 h-10 rounded-full flex items-center justify-center">
            <div className="bg-primary w-6 h-6 rounded-full animate-pulse-soft"></div>
          </div>
          <span className="font-bold text-xl">Catalyst<span className="text-primary">Mom</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={cn("hidden md:flex items-center space-x-8")}>
          <NavLinks closeMenu={closeMenu} />
        </nav>
        
        {/* User actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-full hidden md:flex"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background border-b animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLinks closeMenu={closeMenu} />
            <div className="flex items-center justify-between pt-4 border-t">
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

const NavLinks = ({ closeMenu }: { closeMenu: () => void }) => {
  return (
    <>
      <Link
        to="/"
        className="text-foreground/80 hover:text-primary font-medium transition-colors duration-200"
        onClick={closeMenu}
      >
        Home
      </Link>
      <Link
        to="/dashboard"
        className="text-foreground/80 hover:text-primary font-medium transition-colors duration-200"
        onClick={closeMenu}
      >
        Dashboard
      </Link>
      <Link
        to="/workouts"
        className="text-foreground/80 hover:text-primary font-medium transition-colors duration-200"
        onClick={closeMenu}
      >
        Workouts
      </Link>
      <Link
        to="/wellness"
        className="text-foreground/80 hover:text-primary font-medium transition-colors duration-200"
        onClick={closeMenu}
      >
        Wellness
      </Link>
      <Link
        to="/community"
        className="text-foreground/80 hover:text-primary font-medium transition-colors duration-200"
        onClick={closeMenu}
      >
        Community
      </Link>
    </>
  );
};

export default Navbar;
