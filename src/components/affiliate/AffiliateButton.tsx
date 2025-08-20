import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import AffiliateSignupModal from './AffiliateSignupModal';

interface AffiliateButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const AffiliateButton = ({ variant = "outline", size = "default", className = "" }: AffiliateButtonProps) => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [affiliateStatus, setAffiliateStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (user) {
      checkAffiliateStatus();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const checkAffiliateStatus = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_affiliate_status', { user_id_param: user?.id });

      if (error) {
        console.error('Error checking affiliate status:', error);
        setAffiliateStatus('none');
      } else if (data && data.length > 0) {
        setAffiliateStatus(data[0].status);
      } else {
        setAffiliateStatus('none');
      }
    } catch (error) {
      console.error('Error:', error);
      setAffiliateStatus('none');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    if (affiliateStatus === 'approved') {
      // Redirect to affiliate dashboard
      window.location.href = '/affiliate';
      return;
    }

    if (affiliateStatus === 'none' || affiliateStatus === 'rejected') {
      setIsSignupOpen(true);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    
    switch (affiliateStatus) {
      case 'pending':
        return 'Application Pending';
      case 'approved':
        return 'Affiliate Dashboard';
      case 'rejected':
        return 'Apply Again';
      default:
        return 'Become Affiliate';
    }
  };

  const isDisabled = isLoading || affiliateStatus === 'pending';

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={`gap-2 ${className}`}
        onClick={handleClick}
        disabled={isDisabled}
      >
        <DollarSign className="h-4 w-4" />
        {getButtonText()}
      </Button>
      
      <AffiliateSignupModal 
        isOpen={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)} 
      />
    </>
  );
};

export default AffiliateButton;