
import { ReactNode } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { LostUserNudge } from '@/components/wellness-coach/LostUserNudge';

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
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main
        className={`flex-1 ${withPadding ? 'pt-[calc(4rem+env(safe-area-inset-top,0px))] md:pt-[calc(5rem+env(safe-area-inset-top,0px))]' : 'pt-[calc(3.5rem+env(safe-area-inset-top,0px))]'} ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {children}
      </main>
      <Footer />
      <LostUserNudge />
    </div>
  );
};

export default PageLayout;
