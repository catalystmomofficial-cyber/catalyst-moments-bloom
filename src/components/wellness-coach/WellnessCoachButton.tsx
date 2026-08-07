import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface WellnessCoachButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

/**
 * Opens the coach's own screen rather than a popup. The conversation is the
 * product, not a widget bolted onto whatever page she happened to be on.
 */
const WellnessCoachButton = ({
  variant = 'default',
  size = 'default',
  showLabel = true,
  className,
}: WellnessCoachButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => navigate('/coach')}
      className={className}
    >
      <Heart className={`h-4 w-4 ${showLabel ? 'mr-2' : ''}`} />
      {showLabel && 'Wellness Coach'}
    </Button>
  );
};

export default WellnessCoachButton;
