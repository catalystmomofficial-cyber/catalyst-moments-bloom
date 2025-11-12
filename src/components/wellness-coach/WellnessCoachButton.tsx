
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import EnhancedWellnessCoachModal from './EnhancedWellnessCoachModal';
import { useToast } from '@/hooks/use-toast';

interface WellnessCoachButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

const WellnessCoachButton = ({ 
  variant = 'default', 
  size = 'default',
  showLabel = true,
  className 
}: WellnessCoachButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenModal = () => {
    setIsModalOpen(true);
    toast({
      title: "Wellness Coach",
      description: "Your wellness coach is here to help!",
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
        {showLabel && 'Wellness Coach'}
      </Button>

      <EnhancedWellnessCoachModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default WellnessCoachButton;
