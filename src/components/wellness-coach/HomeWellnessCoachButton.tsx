import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import HomeWellnessCoachModal from './HomeWellnessCoachModal';
import { useToast } from '@/hooks/use-toast';

interface HomeWellnessCoachButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

const HomeWellnessCoachButton = ({ 
  variant = 'default', 
  size = 'default',
  showLabel = true,
  className 
}: HomeWellnessCoachButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenModal = () => {
    setIsModalOpen(true);
    toast({
      title: "Wellness Coach",
      description: "Learn how Catalyst Mom can support your journey!",
      duration: 3000,
    });
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenModal}
        className={className}
      >
        <Heart className={`h-4 w-4 ${showLabel ? 'mr-2' : ''}`} />
        {showLabel && 'Talk to Wellness Coach'}
      </Button>

      <HomeWellnessCoachModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default HomeWellnessCoachButton;
