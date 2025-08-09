import React from 'react';

interface SubscriptionButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

/**
 * Temporarily disabled checkout in the editor.
 * This component renders nothing so premium CTAs don't block editing.
 */
const SubscriptionButton = ({ variant = "default", size = "default", className }: SubscriptionButtonProps) => {
  return null;
};

export default SubscriptionButton;