
import { ReactNode } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';

interface PageLayoutProps {
  children: ReactNode;
  withPadding?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const PageLayout = ({ 
  children, 
  withPadding = true, 
  fullWidth = false,
  className = ""
}: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main 
        className={`flex-1 ${withPadding ? 'pt-16 md:pt-20' : 'pt-14'} ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
